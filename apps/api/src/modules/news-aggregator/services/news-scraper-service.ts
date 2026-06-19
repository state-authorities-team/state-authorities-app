import * as cheerio from "cheerio";
import type { ScrapeSelectors } from "../schemas/scrape-selectors-schema.js";
import type { NewsDataInput } from "../types/news-types.js";

function parseDate(rawDateStr: string): Date {
  if (!rawDateStr) {
    return new Date();
  }

  const cleaned = rawDateStr.trim();

  // Match formats like DD.MM.YYYY or DD/MM/YYYY, with optional HH:MM[:SS]
  const match = cleaned.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS Date months are 0-11
    const year = parseInt(match[3], 10);
    const hours = match[4] ? parseInt(match[4], 10) : 0;
    const minutes = match[5] ? parseInt(match[5], 10) : 0;
    const seconds = match[6] ? parseInt(match[6], 10) : 0;

    const date = new Date(year, month, day, hours, minutes, seconds);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  // Fallback to native parsing
  const parsed = new Date(cleaned);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

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
