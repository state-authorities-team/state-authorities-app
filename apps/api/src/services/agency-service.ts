import type { Prisma } from "@prisma/client";
import prisma from "../configs/db-config.js";
import ApiError from "../errors/ApiError.js";

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
  const agencyType = await prisma.agencyType.findUnique({
    where: { id: Number(data.typeId) },
  });
  if (!agencyType) {
    throw ApiError.notFound(`AgencyType with id ${data.typeId} not found`);
  }

  const agency = await prisma.agency.findUnique({
    where: { id: Number(data.id) },
  });
  if (agency) {
    throw ApiError.conflict(`Agency with id ${data.id} already exists`);
  }

  return prisma.agency.create({ data, include: { agencyType: true } });
};

export const update = async (id: number, data: Prisma.AgencyUncheckedUpdateInput) => {
  if (data.typeId !== undefined) {
    const agencyType = await prisma.agencyType.findUnique({
      where: { id: Number(data.typeId) },
    });
    if (!agencyType) {
      throw ApiError.notFound(`AgencyType with id ${data.typeId} not found`);
    }
  }

  const existing = await prisma.agency.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound(`Agency with id ${id} not found`);
  }

  return prisma.agency.update({ where: { id }, data, include: { agencyType: true } });
};

export const remove = async (id: number) => {
  const existing = await prisma.agency.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound(`Agency with id ${id} not found`);
  }

  return prisma.agency.delete({ where: { id } });
};
