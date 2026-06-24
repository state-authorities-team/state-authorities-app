import * as dotenv from "dotenv";
import { logger as baseLogger } from "../../configs/logger-config.js";
import type { ScrapeSelectors } from "./schemas/scrape-selectors-schema.js";
import { NewsDataService } from "./services/news-data-service.js";
import { NewsImportService } from "./services/news-import-service.js";
import type { NewsDataInput } from "./types/news-types.js";

dotenv.config();

const logger = baseLogger.child({ service: "OrchestratorTestHarness" });

const runOrchestratorTest = async (): Promise<void> => {
  logger.info("Initializing integration pipeline orchestrator test harness...");

  const mockRepository = new NewsDataService();

  mockRepository.getScrapeConfig = async (agencyId: number): Promise<ScrapeSelectors | null> => {
    logger.debug(
      `[Mock DB] getScrapeConfigRecord invoked for agency ${agencyId}. Returning stubbed targets.`,
    );
    return {
      container: "div.old-news-card-class-that-will-fail", // just old class for selfcured test
      title: "h3",
      url: "a",
      date: "span",
    };
  };

  // Mocked config update method (when AI will find new classes than orchestrator calls this method)
  mockRepository.upsertScrapeConfig = async (
    agencyId: number,
    selectors: ScrapeSelectors,
  ): Promise<void> => {
    logger.debug(
      `[Mock DB] upsertScrapeConfig interceptor triggered for agency ${agencyId}. ` +
        `New selectors saved: ${JSON.stringify(selectors)}`,
    );
  };

  // Mock news records
  mockRepository.upsertManyNews = async (
    newsItems: NewsDataInput[],
    agencyId: number,
  ): Promise<number> => {
    logger.debug(
      `[Mock DB] upsertManyNews intercepted. Received ${newsItems.length} elements for agency ${agencyId}.`,
    );
    return newsItems.length;
  };

  const syncService = new NewsImportService(mockRepository);

  try {
    // Run orchestrator with site (Хмельницька ОДА)
    const targetUrl = "https://www.adm-km.gov.ua/";

    logger.info(
      `Triggering active syncAgencyNews live execution pipeline against target: ${targetUrl}`,
    );
    const startTime = Date.now();

    const totalSynced = await syncService.runAutomatedLiveImport(999, targetUrl);

    const endTime = Date.now();
    const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);

    logger.info("============== ORCHESTRATOR PIPELINE RESULT ==============");
    logger.info(`Execution Performance Profile: ${durationSeconds} seconds`);
    logger.info(`Total News Successfully Synced (Mocked Storage Layout): ${totalSynced}`);
    logger.info("===========================================================");

    if (totalSynced > 0) {
      logger.info(
        "✅ SUCCESS: Self-healing live orchestration sequence completed cleanly without physical DB blocks!",
      );
    } else {
      logger.warn(
        "⚠️ WARNING: Sync pipeline executed to completion, but returned exactly 0 news units.",
      );
    }
  } catch (error) {
    logger.error(
      "Orchestrator runtime pipeline compilation or network execution halted critically.",
      error,
    );
  }
};

runOrchestratorTest();
