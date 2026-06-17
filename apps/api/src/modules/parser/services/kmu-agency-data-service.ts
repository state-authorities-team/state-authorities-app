import type { PrismaClient } from "@prisma/client";
import { logger as baseLogger } from "../../../configs/logger-config.js";
import type { ParsedAgencyRow } from "../types/kmu-types.js";

const logger = baseLogger.child({ service: "KmuAgencyDataService" });

export class KmuAgencyDataService {
  async synchronizeAgencies(
    db: PrismaClient,
    records: ParsedAgencyRow[],
    typeMap: Map<string, number>,
  ): Promise<number> {
    let synchronizedCount = 0;

    for (const record of records) {
      const typeId = typeMap.get(record.typeName);

      if (!typeId) {
        logger.warn(`Skipped agency ${record.name}: type "${record.typeName}" not found`);
        continue;
      }

      await db.agency.upsert({
        where: { name: record.name },
        update: {
          website: record.website,
          typeId: typeId,
        },
        create: {
          name: record.name,
          website: record.website,
          typeId: typeId,
        },
      });
      synchronizedCount++;
    }
    return synchronizedCount;
  }
}
