import type { Prisma } from "@prisma/client";
import prisma from "../../../configs/db-config.js";
import type { NewsDataInput, ScrapeSelectors } from "../types/news-types.js";

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
    for (const item of newsItems) {
      await prisma.news.upsert({
        where: { url: item.url },
        update: {
          title: item.title,
          publishedAt: item.publishedAt,
        },
        create: {
          title: item.title,
          url: item.url,
          publishedAt: item.publishedAt,
          agencyId,
        },
      });
    }
    return newsItems.length;
  }
}
