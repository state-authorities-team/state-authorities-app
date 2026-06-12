import * as dotenv from "dotenv";
import { KmuScraperService } from "../parser/services/kmu-scraper-service.js";
import { NewsAiAnalyzerService } from "./services/news-ai-analyzer-service.js";
import { NewsScraperService } from "./services/news-scraper-service.js";

dotenv.config();

const runFullPipelineTest = async (): Promise<void> => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} : [Integration Test] Starting full dynamic scraping pipeline...`);

  // Виберемо сайт Хмельницької ОДА (або будь-який інший державний сайт новин)
  const targetUrl = "https://www.adm-km.gov.ua";

  const browserScraper = new KmuScraperService();
  const aiAnalyzer = new NewsAiAnalyzerService();
  const cheerioParser = new NewsScraperService();

  try {
    const rawHtml = await browserScraper.fetchCatalogHtml(targetUrl);
    console.log(`${timestamp} : [Integration Test] Raw HTML captured via Puppeteer.`);

    const selectors = await aiAnalyzer.generateSelectors(rawHtml);
    console.log("\n[Step 2] AI Matrix Results:");
    console.log(JSON.stringify(selectors, null, 2));

    console.log(
      `\n${timestamp} : [Integration Test] Executing fast runtime parsing via Cheerio...`,
    );
    const newsItems = cheerioParser.parseNewsWithConfig(rawHtml, selectors, targetUrl);

    console.log("\n================ PARSED NEWS FEED RESULT ================");
    console.log(`Total News Discovered: ${newsItems.length}`);
    if (newsItems.length > 0) {
      console.log("First 3 items preview:");
      console.log(JSON.stringify(newsItems.slice(0, 3), null, 2));
    } else {
      console.warn("Warning: Cheerio returned 0 elements based on AI selectors!");
    }
    console.log("============================================================\n");
  } catch (error) {
    console.error(`${timestamp} : [Integration Test CRITICAL ERROR] Pipeline broke!`);
    if (error instanceof Error) {
      console.error(`=> Reason: ${error.message}`);
    }
  }
};

runFullPipelineTest();
