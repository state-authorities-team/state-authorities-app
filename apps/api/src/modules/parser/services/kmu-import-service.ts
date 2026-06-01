import prisma from "../../../configs/db-config.js";
import { slugify } from "../../../utils/slugify.js";

interface CsvRecord {
  name: string;
  typeName: string;
  website: string;
}

export class KmuImportService {
  async seedFromCsv(records: CsvRecord[]): Promise<void> {
    console.log(
      `${new Date().toISOString()} : Start import: got ${records.length} records from CSV`,
    );

    const uniqueTypeNames = Array.from(new Set(records.map((r) => r.typeName)));
    console.log(
      `${new Date().toISOString()} : Found ${uniqueTypeNames.length} unique agencies types`,
    );

    await prisma.$transaction(async (tx) => {
      for (const typeName of uniqueTypeNames) {
        const slug = slugify(typeName);
        await tx.agencyType.upsert({
          where: { slug },
          update: {},
          create: {
            name: typeName,
            slug,
          },
        });
      }

      console.log(
        `${new Date().toISOString()} : All AgencyTypes successfully synchronized with DB`,
      );

      const dbTypes = await tx.agencyType.findMany();

      const typeMap = new Map<string, number>(dbTypes.map((t) => [t.name, t.id]));
      let createdCount = 0;
      console.log(`${new Date().toISOString()} : Synchronization agencies with DB...`);

      for (const record of records) {
        const typeId = typeMap.get(record.typeName);

        if (!typeId) {
          console.warn(
            `${new Date().toISOString()} : Skipped agency ${record.name}: type "${record.typeName}" not found in DB`,
          );
          continue;
        }

        await tx.agency.upsert({
          where: {
            name: record.name,
          },
          update: {
            website: record.website || null,
            typeId: typeId,
          },
          create: {
            name: record.name,
            website: record.website || null,
            typeId: typeId,
          },
        });
        createdCount++;
      }
      console.log(
        `${new Date().toISOString()}: Import is finished! Successfully added ${createdCount} agencies`,
      );
    });
  }
}
