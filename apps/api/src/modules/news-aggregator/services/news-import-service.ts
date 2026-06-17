import type { Prisma } from "@prisma/client";
import { logger as baseLogger } from "../../../configs/logger-config.js";
import { sleep } from "../../../utils/sleep.js";
import { KmuScraperService } from "../../parser/services/kmu-scraper-service.js";
import type { ScrapeSelectors } from "../schemas/scrape-selectors.schema.js";
import { NewsDataService } from "../services/news-data-service.js";
import type { NewsDataInput } from "../types/news-types.js";
import { NewsAiAnalyzerService } from "./news-ai-analyzer-service.js";
import { NewsScraperService } from "./news-scraper-service.js";

const logger = baseLogger.child({ service: "NewsImportPipeline" });

const AI_ANALYSIS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h cooldown guard
const AI_THROTTLE_DELAY_MS = 4_000; // pause before every request to Gemini

export class NewsImportService {
  private readonly browserScraper = new KmuScraperService();
  private readonly aiAnalyzer: NewsAiAnalyzerService;
  private readonly cheerioParser = new NewsScraperService();
  private readonly newsDataService: NewsDataService;

  constructor(newsDataService = new NewsDataService(), aiAnalyzer = new NewsAiAnalyzerService()) {
    this.newsDataService = newsDataService;
    this.aiAnalyzer = aiAnalyzer;
  }

  async runAutomatedLiveImport(agencyId: number, websiteUrl: string): Promise<number> {
    logger.info(`Initiating pipeline for agency: ${agencyId}`);

    const html = await this.browserScraper.fetchCatalogHtml(websiteUrl);

    const configRecord = await this.newsDataService.getScrapeConfigRecord(agencyId);
    const selectors = await this.resolveSelectors(agencyId, html, configRecord);

    if (!selectors) {
      return 0;
    }

    const maxParseCountConfig =
      await this.newsDataService.getSystemConfigValue("NEWS_MAX_PARSE_COUNT");
    const maxParseCount = Number(maxParseCountConfig);
    const resolvedMaxParseCount =
      Number.isInteger(maxParseCount) && maxParseCount > 0 ? maxParseCount : 10;

    let newsItems = this.cheerioParser.parseNewsWithConfig(
      html,
      selectors,
      websiteUrl,
      resolvedMaxParseCount,
    );

    if (newsItems.length === 0 && configRecord !== null) {
      const healedItems = await this.triggerSelfHealing(
        agencyId,
        html,
        websiteUrl,
        configRecord,
        resolvedMaxParseCount,
      );
      if (healedItems === null) {
        return 0;
      }
      newsItems = healedItems;
    }

    const freshNewsCutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const freshNewsItems = newsItems.filter(
      (item) => item.publishedAt.getTime() >= freshNewsCutoff,
    );

    const upsertedCount = this.newsDataService.upsertManyNews(freshNewsItems, agencyId);
    logger.info(
      `Pipeline finished for agency ${agencyId}. Upserted records count: ${upsertedCount}`,
    );
    return upsertedCount;
  }

  private async resolveSelectors(
    agencyId: number,
    html: string,
    configRecord: { selectors: Prisma.JsonValue; lastAiAnalysedAt: Date | null } | null,
  ): Promise<ScrapeSelectors | null> {
    if (configRecord?.selectors) {
      logger.debug(`Cache hit: Using existing selectors matrix for agency ${agencyId}`);
      return configRecord.selectors as unknown as ScrapeSelectors;
    }

    logger.warn(
      `Target scraping configuration missing for agency ${agencyId}. Running LLM extraction...`,
    );
    await sleep(AI_THROTTLE_DELAY_MS); // throttle before first call

    try {
      const selectors = await this.aiAnalyzer.generateSelectors(html);
      if (!selectors) {
        return null;
      }
      const now = new Date();
      await this.newsDataService.upsertScrapeConfig(agencyId, selectors, now);
      return selectors;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Missing AI_API_KEY")) {
        logger.error(
          `Skipping agency ${agencyId} extraction cascade: AI analyzer component is unconfigured.`,
        );
        return null;
      }
      throw error;
    }
  }

  private async triggerSelfHealing(
    agencyId: number,
    html: string,
    websiteUrl: string,
    configRecord: { selectors: Prisma.JsonValue; lastAiAnalysedAt: Date | null },
    resolvedMaxParseCount: number,
  ): Promise<NewsDataInput[] | null> {
    const now = new Date();
    const lastAnalysed = configRecord.lastAiAnalysedAt;

    if (
      lastAnalysed !== null &&
      lastAnalysed !== undefined &&
      now.getTime() - new Date(lastAnalysed).getTime() < AI_ANALYSIS_COOLDOWN_MS
    ) {
      logger.warn(
        `[Self-Healing Locked] Analysis skipped due to 24h cooldown buffer layer ` +
          `(agency: ${agencyId}, lastAiAnalysedAt: ${new Date(lastAnalysed).toISOString()})`,
      );
      return [];
    }

    logger.error(
      `[Self-Healing] Zero items matched for agency ${agencyId}. Layout distortion suspected. Re-invoking Gemini...`,
    );
    await sleep(AI_THROTTLE_DELAY_MS); // throttle before self-healing call

    try {
      const freshSelectors = await this.aiAnalyzer.generateSelectors(html);
      if (!freshSelectors) {
        return null;
      }
      await this.newsDataService.upsertScrapeConfig(agencyId, freshSelectors, now);

      logger.info(
        `[Self-Healing SUCCESS] New structural layout mapped and saved for agency ${agencyId}`,
      );

      return this.cheerioParser.parseNewsWithConfig(
        html,
        freshSelectors,
        websiteUrl,
        resolvedMaxParseCount,
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("Missing AI_API_KEY")) {
        logger.error(
          `[Self-Healing Failed] Cancelled healing operation for agency ${agencyId} due to missing AI key metadata credentials.`,
        );
        return null;
      }
      throw error;
    }
  }
}
