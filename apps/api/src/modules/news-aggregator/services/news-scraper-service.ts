import * as cheerio from "cheerio";
import { parseDate } from "../../../utils/time.js";
import type { ScrapeSelectors } from "../schemas/scrape-selectors-schema.js";
import type { NewsDataInput } from "../types/news-types.js";

export class NewsScraperService {
  parseNewsWithConfig(
    html: string,
    selectors: ScrapeSelectors,
    baseUrl: string,
    maxCount = 10,
  ): NewsDataInput[] {
    const $ = cheerio.load(html);
    const parsedNews: NewsDataInput[] = [];

    const sanitizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    $(selectors.container).each((_, element) => {
      if (parsedNews.length >= maxCount) {
        return false;
      }

      const titleText = $(element).find(selectors.title).text().trim();
      const rawUrl = $(element).find(selectors.url).attr("href")?.trim() || "";
      const rawDate = $(element).find(selectors.date).text().trim();

      if (!titleText || !rawUrl) {
        return;
      }

      const finalUrl = rawUrl.startsWith("/") ? `${sanitizedBaseUrl}${rawUrl}` : rawUrl;

      const finalDate = parseDate(rawDate);
      parsedNews.push({ title: titleText, url: finalUrl, publishedAt: finalDate });
    });
    return parsedNews;
  }
}
