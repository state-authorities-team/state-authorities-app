import prisma from "../configs/db-config.js";
import ApiError from "../errors/ApiError.js";
import {
  type CreateAgencyTypeSchema,
  createAgencyTypeSchema,
} from "../schemas/agency-type.schema.js";
import { parseAndValidate } from "../utils/csv-parser.js";
import { buildCsvBuffer } from "../utils/csv-writer.js";
import { slugify } from "../utils/slugify.js";

const agencyTypeExportHeaders = ["id", "name", "slug", "createdAt"] as const;

export const getAll = async () => {
  const agencyTypes = await prisma.agencyType.findMany();
  return agencyTypes;
};

export const exportCsv = async () => {
  const agencyTypes = await prisma.agencyType.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });

  const rows = agencyTypes.map((agencyType) => ({
    id: agencyType.id,
    name: agencyType.name,
    slug: agencyType.slug,
    createdAt: agencyType.createdAt,
  }));

  return buildCsvBuffer(agencyTypeExportHeaders, rows);
};

export const importAgencyTypesFromCsv = async (fileBuffer: Buffer) => {
  const { validRecords, skippedRows, totalRows } = await parseAndValidate<CreateAgencyTypeSchema>(
    fileBuffer,
    createAgencyTypeSchema,
    (row) => {
      const cleanedRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "string" && value.trim() === "" ? undefined : value?.toString().trim(),
        ]),
      );

      return {
        name: cleanedRow.name,
        slug: cleanedRow.slug,
      };
    },
  );

  if (totalRows === 0) {
    throw ApiError.badRequest("CSV file is empty");
  }

  if (validRecords.length === 0) {
    throw ApiError.badRequest('CSV file must contain "name" column');
  }

  let imported = 0;
  for (const record of validRecords) {
    const name = record.name.trim();
    const slug = record.slug?.trim() || slugify(name);

    await prisma.agencyType.upsert({
      where: { slug },
      create: { name, slug },
      update: { name, slug },
    });

    imported++;
  }

  return {
    totalRows,
    imported,
    skipped: skippedRows,
    errors: [],
  };
};
