# Architecture Diagrams

Live architectural diagrams of the business processes for the `state-authorities` project.
These diagrams render natively on GitHub thanks to Mermaid.js support.

---

## Diagram 1: Cron Hot-Reload Configuration Process

Describes the 5-minute watchdog cycle of `NewsCronManager`, which monitors changes to
`SystemConfig.NEWS_SYNC_CRON` in the database and gracefully restarts the `node-cron` task
without restarting the server.

**Related files:**
- [`src/modules/news-aggregator/cron/news-cron.ts`](../apps/api/src/modules/news-aggregator/cron/news-cron.ts)
- [`src/index.ts`](../apps/api/src/index.ts)

```mermaid
sequenceDiagram
    participant App as App (index.ts)
    participant CM as NewsCronManager
    participant DB as SystemConfig (PostgreSQL)
    participant Cron as node-cron

    App->>CM: new NewsCronManager()
    App->>CM: initScheduleSync()
    CM->>CM: refreshSchedule() [initial call]
    CM->>DB: findUnique({ key: "NEWS_SYNC_CRON" })
    DB-->>CM: value: "0 */3 * * *" (or default)
    CM->>CM: cron.validate(expression) → valid
    CM->>Cron: schedule(expression, executeSyncPipeline)
    CM-->>CM: currentCronExpression = "0 */3 * * *"

    loop Every 5 minutes (watchdog)
        Cron->>CM: refreshSchedule()
        CM->>DB: findUnique({ key: "NEWS_SYNC_CRON" })
        alt Expression unchanged
            DB-->>CM: same value
            CM-->>CM: skip (no-op)
        else Expression changed
            DB-->>CM: value: "0 */6 * * *"
            CM->>CM: cron.validate("0 */6 * * *")
            alt Valid cron syntax
                CM->>Cron: activeJob.stop()
                CM->>Cron: schedule("0 */6 * * *", executeSyncPipeline)
                CM-->>CM: currentCronExpression = "0 */6 * * *"
            else Invalid syntax
                CM-->>CM: abort reload, keep current job
            end
        end
    end
```

---

## Diagram 2: News Collection Pipeline with Self-Healing

Describes the complete lifecycle of `NewsImportService.runAutomatedLiveImport()`: from Puppeteer scraping
to saving news items in the database, including self-healing logic powered by Gemini and a 24-hour
cooldown guard to limit AI API requests.

**Related files:**
- [`src/modules/news-aggregator/services/news-import-service.ts`](../apps/api/src/modules/news-aggregator/services/news-import-service.ts)
- [`src/modules/news-aggregator/services/news-ai-analyzer-service.ts`](../apps/api/src/modules/news-aggregator/services/news-ai-analyzer-service.ts)
- [`src/modules/news-aggregator/services/news-scraper-service.ts`](../apps/api/src/modules/news-aggregator/services/news-scraper-service.ts)
- [`src/modules/news-aggregator/services/news-data-service.ts`](../apps/api/src/modules/news-aggregator/services/news-data-service.ts)

```mermaid
flowchart TD
    START([runAutomatedLiveImport\nagencyId, websiteUrl]) --> SCRAPE

    SCRAPE["🌐 Puppeteer\nfetchCatalogHtml(websiteUrl)"]
    SCRAPE --> LOAD_CONFIG

    LOAD_CONFIG["🗄️ DB: getScrapeConfigRecord(agencyId)"]
    LOAD_CONFIG --> CONFIG_EXISTS{configRecord\nexists?}

    CONFIG_EXISTS -- "No (first run)" --> THROTTLE_INIT
    CONFIG_EXISTS -- "Yes" --> USE_EXISTING

    THROTTLE_INIT["⏱️ sleep(4000ms)\nAI throttle guard"]
    THROTTLE_INIT --> AI_INIT["🤖 Gemini: generateSelectors(html)"]
    AI_INIT --> SAVE_INIT["🗄️ DB: upsertScrapeConfig\nselectors + lastAiAnalysedAt = now"]
    SAVE_INIT --> CHEERIO

    USE_EXISTING["✅ Use selectors\nfrom configRecord"] --> CHEERIO

    CHEERIO["🔍 Cheerio: parseNewsWithConfig\nhtml, selectors, maxParseCount"]
    CHEERIO --> ITEMS_FOUND{items.length > 0?}

    ITEMS_FOUND -- "Yes" --> FILTER
    ITEMS_FOUND -- "No (config existed)" --> COOLDOWN_CHECK

    COOLDOWN_CHECK{"lastAiAnalysedAt\nwithin 24h?"}
    COOLDOWN_CHECK -- "Yes → Cooldown Active" --> SKIP_HEAL["⚠️ Log: AI locked\nskip self-healing"]
    SKIP_HEAL --> RETURN_ZERO([return 0])

    COOLDOWN_CHECK -- "No → Cooldown Expired" --> THROTTLE_HEAL
    THROTTLE_HEAL["⏱️ sleep(4000ms)\nAI throttle guard"]
    THROTTLE_HEAL --> AI_HEAL["🤖 Gemini: generateSelectors(html)\nSelf-Healing Re-Analysis"]
    AI_HEAL --> SAVE_HEAL["🗄️ DB: upsertScrapeConfig\nnew selectors + lastAiAnalysedAt = now"]
    SAVE_HEAL --> REPARSE["🔍 Cheerio: re-parse\nwith fresh selectors"]
    REPARSE --> FILTER

    FILTER["📅 Filter: publishedAt\n>= now − 3 days"]
    FILTER --> UPSERT["🗄️ DB: upsertManyNews\n(freshNewsItems, agencyId)"]
    UPSERT --> RETURN_COUNT([return syncedCount])
```

### Self-Healing: Key Logic

| State | Behavior |
|---|---|
| No `configRecord` in the DB | First run: AI generates selectors, saves them with `lastAiAnalysedAt = now` |
| `configRecord` exists, `items > 0` | Standard parsing, AI is not called |
| `configRecord` exists, `items == 0`, cooldown is active (`< 24h`) | Self-healing is locked, returns `0` |
| `configRecord` exists, `items == 0`, cooldown expired (`>= 24h`) | AI re-analyzes HTML, updates selectors, parses again |