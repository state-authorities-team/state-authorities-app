import type { Prisma } from "@prisma/client";
import prisma from "../../../configs/db-config.js";
import { logger as baseLogger } from "../../../configs/logger-config.js";
import type { ScrapeSelectors } from "../schemas/scrape-selectors-schema.js";
import type { NewsDataInput } from "../types/news-types.js";

const logger = baseLogger.child({ service: "NewsDataService" });

export class NewsDataService {
  async getSystemConfigValue(key: string): Promise<string | null> {
    const record = await prisma.systemConfig.findUnique({
      where: { key },
    });

    return record?.value ?? null;
  }

  async getScrapeConfig(agencyId: number): Promise<ScrapeSelectors | null> {
    const record = await prisma.scrapeConfig.findUnique({ where: { agencyId } });
    return record?.selectors ? (record.selectors as unknown as ScrapeSelectors) : null;
  }

  async getScrapeConfigRecord(agencyId: number) {
    return prisma.scrapeConfig.findUnique({ where: { agencyId } });
  }

  async upsertScrapeConfig(
    agencyId: number,
    selectors: ScrapeSelectors,
    lastAiAnalysedAt?: Date | null,
  ): Promise<void> {
    const jsonInput = selectors as unknown as Prisma.InputJsonValue;
    await prisma.scrapeConfig.upsert({
      where: { agencyId },
      update: {
        selectors: jsonInput,
        ...(lastAiAnalysedAt !== undefined ? { lastAiAnalysedAt } : {}),
      },
      create: {
        agencyId,
        selectors: jsonInput,
        ...(lastAiAnalysedAt !== undefined ? { lastAiAnalysedAt } : {}),
      },
    });
  }

  async upsertManyNews(newsItems: NewsDataInput[], agencyId: number): Promise<number> {
    if (newsItems.length === 0) {
      return 0;
    }

    const incomingUrls = newsItems.map((item) => item.url);

    const existingRecords = await prisma.news.findMany({
      where: { url: { in: incomingUrls } },
      select: { url: true },
    });

    const existingUrlSet = new Set(existingRecords.map((r) => r.url));
    const newItems = newsItems.filter((item) => !existingUrlSet.has(item.url));

    if (newItems.length === 0) {
      logger.debug(
        `Agency ${agencyId}: all ${newsItems.length} article(s) already exist. No inserts performed.`,
      );
      return 0;
    }

    const result = await prisma.news.createMany({
      data: newItems.map((item) => ({
        title: item.title,
        url: item.url,
        publishedAt: item.publishedAt,
        agencyId,
      })),
      skipDuplicates: true, // safety net
    });

    logger.info(`Agency ${agencyId}: inserted ${result.count} new article(s).`);
    return result.count;
  }
}
