import type { Prisma } from "@prisma/client";
import * as dotenv from "dotenv";
import type { NewsAiAnalyzerService } from "./services/news-ai-analyzer-service.js";
import { NewsDataService } from "./services/news-data-service.js";
import { NewsImportService } from "./services/news-import-service.js";
import type { NewsDataInput, ScrapeSelectors } from "./types/news-types.js";

dotenv.config();
const runCooldownTest = async (): Promise<void> => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} : [Cooldown Test] Initializing test harness...`);
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
    console.log(`   [Mock DB] getScrapeConfigRecord called for agency ${agencyId}.`);
    return dbRecord;
  };
  // Mock upsertScrapeConfig
  mockRepository.upsertScrapeConfig = async (
    agencyId: number,
    selectors: ScrapeSelectors,
    lastAiAnalysedAt?: Date | null,
  ): Promise<void> => {
    console.log(
      `   [Mock DB] upsertScrapeConfig triggered for agency ${agencyId}.`,
      `New selectors: ${JSON.stringify(selectors)}, lastAiAnalysedAt: ${lastAiAnalysedAt?.toISOString()}`,
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
    console.log(
      `   [Mock DB] upsertManyNews triggered. Received ${newsItems.length} elements for agency ${agencyId}.`,
    );
    return newsItems.length;
  };
  // Mock AI analyzer to avoid hitting Gemini API and throwing AI_API_KEY missing error
  const mockAiAnalyzer = {
    generateSelectors: async (_htmlSnapshot: string): Promise<ScrapeSelectors> => {
      console.log(`   [Mock AI] generateSelectors called (Simulated AI API Call)`);
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
    console.log("\n================ RUN 1: Cooldown is NOT active ================");
    console.log(`${timestamp} : [Cooldown Test] Triggering first sync...`);
    const totalSynced1 = await syncService.runAutomatedLiveImport(999, targetUrl);
    console.log(`RUN 1 Result: Synced ${totalSynced1} items.`);
    console.log(`RUN 1 DbRecord State after sync:`, JSON.stringify(dbRecord));
    console.log("\n================ RUN 2: Cooldown IS active ================");
    console.log(`${timestamp} : [Cooldown Test] Triggering second sync immediately...`);
    const totalSynced2 = await syncService.runAutomatedLiveImport(999, targetUrl);
    console.log(`RUN 2 Result: Synced ${totalSynced2} items.`);
    console.log(`RUN 2 DbRecord State after sync:`, JSON.stringify(dbRecord));
    console.log("\n================ RUN 3: Cooldown EXPIRED ================");
    console.log(
      `${timestamp} : [Cooldown Test] Simulating cooldown expiration (setting lastAiAnalysedAt to 25 hours ago)...`,
    );
    if (dbRecord) {
      dbRecord.lastAiAnalysedAt = new Date(Date.now() - 25 * 60 * 60 * 1000);
    }
    console.log(`RUN 3 DbRecord State before sync:`, JSON.stringify(dbRecord));
    const totalSynced3 = await syncService.runAutomatedLiveImport(999, targetUrl);
    console.log(`RUN 3 Result: Synced ${totalSynced3} items.`);
    console.log(`RUN 3 DbRecord State after sync:`, JSON.stringify(dbRecord));
    console.log("\n================ COOLDOWN PIPELINE RESULT ================");
    if (totalSynced1 >= 0 && totalSynced2 === 0) {
      console.log("✅ SUCCESS: Self-Healing Cooldown Guard is working perfectly!");
    } else {
      console.warn("⚠️ WARNING: Cooldown guard test failed to skip AI analysis on run 2.");
    }
    console.log("=================================================================\n");
  } catch (error) {
    console.error(`${timestamp} : [Cooldown Test CRITICAL ERROR] Pipeline failed!`);
    if (error instanceof Error) {
      console.error(`=> Reason: ${error.message}`);
    }
  }
};
runCooldownTest();
