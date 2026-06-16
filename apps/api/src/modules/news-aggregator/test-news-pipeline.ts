import * as dotenv from "dotenv";
import type { ScrapeSelectors } from "./schemas/scrape-selectors.schema.js";
import { NewsDataService } from "./services/news-data-service.js";
import { NewsImportService } from "./services/news-import-service.js";
import type { NewsDataInput } from "./types/news-types.js";

dotenv.config();

const runOrchestratorTest = async (): Promise<void> => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} : [Orchestrator Test] Initializing test harness...`);

  const mockRepository = new NewsDataService();

  mockRepository.getScrapeConfig = async (agencyId: number): Promise<ScrapeSelectors | null> => {
    console.log(
      `   [Mock DB] getScrapeConfig called for agency ${agencyId}. Returning stubbed selectors.`,
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
    console.log(
      `   [Mock DB] ✅ SUCCESS: upsertScrapeConfig triggered for agency ${agencyId}. New selectors saved:`,
      JSON.stringify(selectors),
    );
  };

  // Mock news records
  mockRepository.upsertManyNews = async (
    newsItems: NewsDataInput[],
    agencyId: number,
  ): Promise<number> => {
    console.log(
      `   [Mock DB] ✅ SUCCESS: upsertManyNews triggered. Received ${newsItems.length} elements for agency ${agencyId}.`,
    );
    return newsItems.length;
  };

  const syncService = new NewsImportService(mockRepository);

  try {
    // Run orchestrator with site (Хмельницька ОДА)
    const targetUrl = "https://www.adm-km.gov.ua/";

    console.log(`${timestamp} : [Orchestrator Test] Triggering syncAgencyNews pipeline...`);
    const startTime = Date.now();

    const totalSynced = await syncService.runAutomatedLiveImport(999, targetUrl);

    const endTime = Date.now();

    // Results
    console.log("\n================ ORCHESTRATOR PIPELINE RESULT ================");
    console.log(`Execution Time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    console.log(`Total News Successfully Synced (Mocked Storage): ${totalSynced}`);
    console.log("=================================================================\n");

    if (totalSynced > 0) {
      console.log(" Test successfully finished! Selfcured logic worked without DB");
    } else {
      console.warn("Warning: Pipeline finished, but returned 0 news.");
    }
  } catch (error) {
    console.error(`${timestamp} : [Orchestrator Test CRITICAL ERROR] Pipeline failed!`);
    if (error instanceof Error) {
      console.error(`=> Reason: ${error.message}`);
    }
  }
};

runOrchestratorTest();
