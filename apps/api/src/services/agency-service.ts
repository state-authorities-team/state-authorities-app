import type { Prisma } from "@prisma/client";
import prisma from "../configs/db-config.js";
import { logger as baseLogger } from "../configs/logger-config.js";
import ApiError from "../errors/ApiError.js";
import { type ImportAgencySchema, importAgencySchema } from "../schemas/agency.schema.js";
import type { getAgencyQuery } from "../types/get-agency-query.js";
import { parseAndValidate } from "../utils/csv-parser.js";
import { buildCsvBuffer } from "../utils/csv-writer.js";

const logger = baseLogger.child({ service: "AgencyService" });
const agencyExportHeaders = ["id", "name", "website", "typeName", "createdAt"] as const;

export const getAll = async (params: getAgencyQuery) => {
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

export const getById = async (id: number) => {
  const agency = await prisma.agency.findUnique({
    where: { id },
    include: { agencyType: true },
  });
  if (!agency) {
    throw ApiError.notFound(`Agency with id ${id} not found`);
  }
  return agency;
};

export const create = async (data: Prisma.AgencyUncheckedCreateInput) => {
  const agencyType = await prisma.agencyType.findUnique({
    where: { id: Number(data.typeId) },
  });
  if (!agencyType) {
    throw ApiError.notFound(`AgencyType with id ${data.typeId} not found`);
  }

  const agency = await prisma.agency.findFirst({
    where: { name: data.name },
  });
  if (agency) {
    throw ApiError.conflict(`Agency with name ${data.name} already exists`);
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

  return prisma.agency.update({
    where: { id },
    data,
    include: { agencyType: true },
  });
};

export const remove = async (id: number) => {
  const existing = await prisma.agency.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound(`Agency with id ${id} not found`);
  }

  return prisma.agency.delete({ where: { id } });
};

export const exportCsv = async () => {
  const agencies = await prisma.agency.findMany({
    select: {
      id: true,
      name: true,
      website: true,
      createdAt: true,
      agencyType: {
        select: {
          name: true,
        },
      },
    },
  });

  const rows = agencies.map((agency) => ({
    id: agency.id,
    name: agency.name,
    website: agency.website,
    typeName: agency.agencyType.name,
    createdAt: agency.createdAt,
  }));

  return buildCsvBuffer(agencyExportHeaders, rows);
};

export const importAgencyFromCsv = async (fileBuffer: Buffer) => {
  const agencyTypes = await prisma.agencyType.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const agencyTypeMap = new Map(agencyTypes.map((agencyType) => [agencyType.name, agencyType.id]));

  const { validRecords, skippedRows, totalRows } = await parseAndValidate<ImportAgencySchema>(
    fileBuffer,
    importAgencySchema,
    (row) => {
      const cleanedRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          value.trim() === "" ? undefined : value.trim(),
        ]),
      );

      return {
        ...cleanedRow,
      };
    },
  );
  let imported = 0;
  let skippedByMissingType = 0;

  for (const record of validRecords) {
    const normalizedName = record.name.trim();
    const normalizedTypeName = record.typeName.trim();
    const typeId = agencyTypeMap.get(normalizedTypeName);

    if (!typeId) {
      skippedByMissingType++;
      logger.warn(`[CSV Import] Skipped agency ${record.name}: type "${normalizedTypeName}" not found`)
      continue;
    }

    await prisma.agency.upsert({
      where: { name: normalizedName },
      update: {
        website: record.website,
        shortName: record.shortName,
        headName: record.headName,
        headTitle: record.headTitle,
        description: record.description,
        address: record.address,
        phone: record.phone,
        email: record.email,
        region: record.region,
        typeId,
      },
      create: {
        name: normalizedName,
        website: record.website,
        shortName: record.shortName,
        headName: record.headName,
        headTitle: record.headTitle,
        description: record.description,
        address: record.address,
        phone: record.phone,
        email: record.email,
        region: record.region,
        typeId,
      },
    });

    imported++;
  }
  return {
    totalRows,
    imported,
    skipped: skippedRows + skippedByMissingType,
  };
};
