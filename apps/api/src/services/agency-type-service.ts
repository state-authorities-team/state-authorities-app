import prisma from "../configs/db-config.js";
import ApiError from "../errors/ApiError.js";
import { parseCsvBuffer } from "../utils/csv-parser.js";
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
  const rows = await parseCsvBuffer(fileBuffer);

  if (rows.length === 0) {
    throw ApiError.badRequest("CSV file is empty");
  }

  if (!Object.hasOwn(rows[0], "name")) {
    throw ApiError.badRequest('CSV file must contain "name" column');
  }

  let imported = 0;
  let skipped = 0;
  const rowErrors: string[] = [];

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;

    try {
      const name = row.name?.trim();
      const slugFromFile = row.slug?.trim();
      const slug = slugFromFile || (name ? slugify(name) : "");

      if (!name) {
        throw new Error('Missing required field "name"');
      }

      if (!slug) {
        throw new Error("Unable to generate slug");
      }

      await prisma.agencyType.upsert({
        where: { slug },
        create: { name, slug },
        update: { name, slug },
      });

      imported++;
    } catch (error) {
      skipped++;
      const message = error instanceof Error ? error.message : "Unknown import error";
      rowErrors.push(`Row ${rowNumber}: ${message}`);
      console.warn(`${new Date().toISOString()} [AgencyType CSV] Row ${rowNumber} skipped`, error);
    }
  }

  return {
    totalRows: rows.length,
    imported,
    skipped,
    errors: rowErrors,
  };
};
