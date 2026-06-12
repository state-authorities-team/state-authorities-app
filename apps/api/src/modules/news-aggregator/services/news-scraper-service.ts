import * as cheerio from "cheerio";
import type { NewsDataInput, ScrapeSelectors } from "../types/news-types.js";

export class NewsScraperService {
  parseNewsWithConfig(html: string, selectors: ScrapeSelectors, baseUrl: string): NewsDataInput[] {
    const $ = cheerio.load(html);
    const parsedNews: NewsDataInput[] = [];

    const sanitizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    $(selectors.container).each((_, element) => {
      const titleText = $(element).find(selectors.title).text().trim();
      const rawUrl = $(element).find(selectors.url).attr("href")?.trim() || "";
      const rawDate = $(element).find(selectors.date).text().trim();

      if (!titleText || !rawUrl) {
        return;
      }

      const finalUrl = rawUrl.startsWith("/") ? `${sanitizedBaseUrl}/${rawUrl}` : rawUrl;

      const parsedDate = rawDate ? new Date(rawDate) : new Date();
      const finalDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      parsedNews.push({ title: titleText, url: finalUrl, publishedAt: finalDate });
    });
    return parsedNews;
  }
}
