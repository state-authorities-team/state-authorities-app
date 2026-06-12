import { KmuScraperService } from "../../parser/services/kmu-scraper-service.js";
import { NewsDataService } from "../services/news-data-service.js";
import { NewsAiAnalyzerService } from "./news-ai-analyzer-service.js";
import { NewsScraperService } from "./news-scraper-service.js";

export class NewsImportService {
  private readonly browserScraper = new KmuScraperService();
  private readonly aiAnalyzer = new NewsAiAnalyzerService();
  private readonly cheerioParser = new NewsScraperService();
  private readonly newsDataService = new NewsDataService();

  async runAutomatedLiveImport(agencyId: number, websiteUrl: string): Promise<number> {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} : [NewsSync] Initiating pipeline for agency: ${agencyId}`);

    const html = await this.browserScraper.fetchCatalogHtml(websiteUrl);

    let selectors = await this.newsDataService.getScrapeConfig(agencyId);

    if (!selectors) {
      console.log(
        `${timestamp} : [NewsSync] Target configuration missing. Running LLM extraction...`,
      );

      selectors = await this.aiAnalyzer.generateSelectors(html);
      await this.newsDataService.upsertScrapeConfig(agencyId, selectors);
    }

    let newsItems = this.cheerioParser.parseNewsWithConfig(html, selectors, websiteUrl);

    if (newsItems.length === 0) {
      console.warn(
        `${timestamp} : [Self-Healing] Zero items matched. Layout change suspected. Re-invoking AI...`,
      );

      const freshSelectors = await this.aiAnalyzer.generateSelectors(html);
      await this.newsDataService.upsertScrapeConfig(agencyId, freshSelectors);

      newsItems = this.cheerioParser.parseNewsWithConfig(html, freshSelectors, websiteUrl);
    }

    return this.newsDataService.upsertManyNews(newsItems, agencyId);
  }
}
