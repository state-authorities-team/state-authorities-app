import type { Prisma } from "@prisma/client";
import prisma from "../configs/db-config.js";

export const getAll = async (params: {
  type?: string;
  search?: string;
  page: number;
  limit: number;
}) => {
  const { type, search, page, limit } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.AgencyWhereInput = {};

  if (type) {
    where.agencyType = { slug: type };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [agencies, total] = await Promise.all([
    prisma.agency.findMany({
      where,
      skip,
      take: limit,
      include: { agencyType: true },
    }),
    prisma.agency.count({ where }),
  ]);

  return {
    data: agencies,
    total,
    count: agencies.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const create = async (data: Prisma.AgencyUncheckedCreateInput) => {
  return prisma.agency.create({ data, include: { agencyType: true } });
};

export const update = async (id: number, data: Prisma.AgencyUncheckedUpdateInput) => {
  return prisma.agency.update({ where: { id }, data, include: { agencyType: true } });
};

export const remove = async (id: number) => {
  return prisma.agency.delete({ where: { id } });
};
