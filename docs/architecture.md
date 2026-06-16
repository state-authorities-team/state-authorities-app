# Architecture Diagrams

Живі архітектурні діаграми бізнес-процесів проєкту `state-authorities`.
Рендеряться нативно у GitHub завдяки підтримці Mermaid.js.

---

## Diagram 1: Cron Hot-Reload Configuration Process

Описує 5-хвилинний watchdog-цикл `NewsCronManager`, який слідкує за змінами
`SystemConfig.NEWS_SYNC_CRON` у БД та м'яко перезапускає `node-cron`-задачу
без перезавантаження сервера.

**Пов'язані файли:**
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

Описує повний цикл `NewsImportService.runAutomatedLiveImport()`: від Puppeteer-скрапінгу
до збереження новин у БД, включаючи логіку самолікування через Gemini та 24-годинний
cooldown guard для обмеження звернень до AI API.

**Пов'язані файли:**
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

### Self-Healing: ключова логіка

| Стан | Поведінка |
|---|---|
| Немає `configRecord` у БД | Перший запуск: AI генерує селектори, зберігає з `lastAiAnalysedAt = now` |
| `configRecord` є, `items > 0` | Штатний парсинг, AI не викликається |
| `configRecord` є, `items == 0`, cooldown активний (`< 24h`) | Self-healing заблоковано, повертає `0` |
| `configRecord` є, `items == 0`, cooldown минув (`>= 24h`) | AI re-аналізує HTML, оновлює селектори, повторний парсинг |