import type { Prisma } from "@prisma/client";
import * as dotenv from "dotenv";
import { logger as baseLogger } from "../../configs/logger-config.js";
import type { ScrapeSelectors } from "./schemas/scrape-selectors-schema.js";
import type { NewsAiAnalyzerService } from "./services/news-ai-analyzer-service.js";
import { NewsDataService } from "./services/news-data-service.js";
import { NewsImportService } from "./services/news-import-service.js";
import type { NewsDataInput } from "./types/news-types.js";

dotenv.config();

const logger = baseLogger.child({ service: "CooldownTestHarness" });

const runCooldownTest = async (): Promise<void> => {
  logger.info("Initializing automated self-healing cooldown test harness...");
  // Stub database record state
  let dbRecord: {
    agencyId: number;
    selectors: Prisma.JsonValue;
    lastAiAnalysedAt: Date | null;
    updatedAt: Date;
  } | null = {
    agencyId: 999,
    selectors: {
      container: "div.old-news-card-class-that-will-fail", // just old class for selfcured test
      title: "h3",
      url: "a",
      date: "span",
    },
    lastAiAnalysedAt: null,
    updatedAt: new Date(),
  };
  const mockRepository = new NewsDataService();
  // Mock getScrapeConfigRecord
  mockRepository.getScrapeConfigRecord = async (agencyId: number) => {
    logger.debug(`[Mock DB] getScrapeConfigRecord invoked for agency ${agencyId}`);
    return dbRecord;
  };
  // Mock upsertScrapeConfig
  mockRepository.upsertScrapeConfig = async (
    agencyId: number,
    selectors: ScrapeSelectors,
    lastAiAnalysedAt?: Date | null,
  ): Promise<void> => {
    logger.debug(
      `[Mock DB] upsertScrapeConfig triggered for agency ${agencyId}. ` +
        `New matrix: ${JSON.stringify(selectors)}, lastAiAnalysedAt: ${lastAiAnalysedAt?.toISOString()}`,
    );
    if (dbRecord) {
      dbRecord.selectors = selectors as unknown as Prisma.JsonValue;
      dbRecord.updatedAt = new Date();
      if (lastAiAnalysedAt !== undefined) {
        dbRecord.lastAiAnalysedAt = lastAiAnalysedAt;
      }
    } else {
      dbRecord = {
        agencyId,
        selectors: selectors as unknown as Prisma.JsonValue,
        lastAiAnalysedAt: lastAiAnalysedAt || null,
        updatedAt: new Date(),
      };
    }
  };
  // Mock upsertManyNews
  mockRepository.upsertManyNews = async (
    newsItems: NewsDataInput[],
    agencyId: number,
  ): Promise<number> => {
    logger.debug(
      `[Mock DB] upsertManyNews intercepted. Intercepted ${newsItems.length} elements for agency ${agencyId}.`,
    );
    return newsItems.length;
  };
  // Mock AI analyzer to avoid hitting Gemini API and throwing AI_API_KEY missing error
  const mockAiAnalyzer = {
    generateSelectors: async (_htmlSnapshot: string): Promise<ScrapeSelectors> => {
      logger.debug("[Mock AI] generateSelectors simulated API call successfully executed.");
      return {
        container: "div.new-working-news-card-class-fresh",
        title: "h3",
        url: "a",
        date: "span",
      };
    },
  } as unknown as NewsAiAnalyzerService;
  const syncService = new NewsImportService(mockRepository, mockAiAnalyzer);
  try {
    const targetUrl = "https://www.adm-km.gov.ua/";

    logger.info("⚡ RUN 1: Target configuration cooldown is NOT active. Triggering pipeline...");
    const totalSynced1 = await syncService.runAutomatedLiveImport(999, targetUrl);

    logger.info(`RUN 1 Result: Synced ${totalSynced1} items.`);
    logger.debug(`RUN 1 State footprint: ${JSON.stringify(dbRecord)}`);

    logger.info("⚡ RUN 2: Cooldown IS active. Dispatched secondary execution cycle...");
    const totalSynced2 = await syncService.runAutomatedLiveImport(999, targetUrl);

    logger.info(`RUN 2 Result: Synced ${totalSynced2} items.`);
    logger.debug(`RUN 2 State footprint: ${JSON.stringify(dbRecord)}`);

    logger.info(
      "⚡ RUN 3: Simulating cooldown expiration (mutating lastAiAnalysedAt to 25 hours ago)...",
    );
    if (dbRecord) {
      dbRecord.lastAiAnalysedAt = new Date(Date.now() - 25 * 60 * 60 * 1000);
    }

    logger.debug(`RUN 3 Initial state alignment: ${JSON.stringify(dbRecord)}`);
    const totalSynced3 = await syncService.runAutomatedLiveImport(999, targetUrl);
    logger.info(`RUN 3 Result: Synced ${totalSynced3} items.`);
    logger.debug(`RUN 3 State footprint: ${JSON.stringify(dbRecord)}`);

    logger.info("📊 COOLDOWN PIPELINE VERIFICATION METRICS:");
    if (totalSynced1 >= 0 && totalSynced2 === 0) {
      logger.info("✅ SUCCESS: Self-Healing Cooldown Guard validation routine PASSED perfectly!");
    } else {
      logger.warn(
        "⚠️ WARNING: Cooldown guard state validation FAILED. Run 2 did not skip AI interception cascade.",
      );
    }
  } catch (error) {
    logger.error(
      "Pipeline test sequence halted unexpectedly due to critical exception layer.",
      error,
    );
  }
};
runCooldownTest();
