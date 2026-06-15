import { sleep } from "../../../utils/sleep.js";
import { KmuScraperService } from "../../parser/services/kmu-scraper-service.js";
import { NewsDataService } from "../services/news-data-service.js";
import type { ScrapeSelectors } from "../types/news-types.js";
import { NewsAiAnalyzerService } from "./news-ai-analyzer-service.js";
import { NewsScraperService } from "./news-scraper-service.js";

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
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} : [NewsSync] Initiating pipeline for agency: ${agencyId}`);

    const html = await this.browserScraper.fetchCatalogHtml(websiteUrl);

    const configRecord = await this.newsDataService.getScrapeConfigRecord(agencyId);
    const hadExistingConfig = configRecord !== null;
    let selectors = configRecord?.selectors
      ? (configRecord.selectors as unknown as ScrapeSelectors)
      : null;

    if (!selectors) {
      console.log(
        `${timestamp} : [NewsSync] Target configuration missing. Running LLM extraction...`,
      );
      await sleep(AI_THROTTLE_DELAY_MS); // throttle before first call
      selectors = await this.aiAnalyzer.generateSelectors(html);
      const now = new Date();
      await this.newsDataService.upsertScrapeConfig(agencyId, selectors, now);
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

    if (newsItems.length === 0 && hadExistingConfig) {
      const now = new Date();
      const lastAnalysed = configRecord.lastAiAnalysedAt;

      if (
        lastAnalysed !== null &&
        lastAnalysed !== undefined &&
        now.getTime() - new Date(lastAnalysed).getTime() < AI_ANALYSIS_COOLDOWN_MS
      ) {
        console.warn(
          `${timestamp} : [Self-Healing Locked] AI analysis skipped due to 24h cooldown` +
            ` (agency: ${agencyId}, lastAiAnalysedAt: ${new Date(lastAnalysed).toISOString()})`,
        );
        return 0;
      }

      console.warn(
        `${timestamp} : [Self-Healing] Zero items matched. Layout change suspected. Re-invoking AI...`,
      );
      await sleep(AI_THROTTLE_DELAY_MS); // throttle before self-healing call
      const freshSelectors = await this.aiAnalyzer.generateSelectors(html);
      await this.newsDataService.upsertScrapeConfig(agencyId, freshSelectors, now);
      newsItems = this.cheerioParser.parseNewsWithConfig(
        html,
        freshSelectors,
        websiteUrl,
        resolvedMaxParseCount,
      );
    }

    const freshNewsCutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const freshNewsItems = newsItems.filter(
      (item) => item.publishedAt.getTime() >= freshNewsCutoff,
    );

    return this.newsDataService.upsertManyNews(freshNewsItems, agencyId);
  }
}
