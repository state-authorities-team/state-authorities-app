import prisma from "../configs/db-config.js";
import ApiError from "../errors/api-error.js";
import type { GetNewsQuerySchema } from "../schemas/news-schema.js";

export const getNewsByAgency = async (agencyId: number, params: GetNewsQuerySchema) => {
  const { page, limit } = params;

  const agency = await prisma.agency.findUnique({
    where: { id: agencyId },
  });

  if (!agency) {
    throw ApiError.notFound(`Agency with id ${agencyId} was not found`);
  }

  const skip = (page - 1) * limit;
  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: {
        agencyId: agencyId,
      },
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.news.count({
      where: {
        agencyId: agencyId,
      },
    }),
  ]);

  return {
    data: news,
    total,
    count: news.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};
