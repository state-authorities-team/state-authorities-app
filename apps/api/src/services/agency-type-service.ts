import prisma from "../configs/db-config.js";
import { parseCsvBuffer } from "../utils/csv-parser.js";
import { buildCsvBuffer } from "../utils/csv-writer.js";

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

  return {
    totalRows: rows.length,
    rows,
  };
};
