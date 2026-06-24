import type { PrismaClient } from "@prisma/client";
import { logger as baseLogger } from "../../../configs/logger-config.js";
import { slugify } from "../../../utils/slugify.js";

const logger = baseLogger.child({ service: "KmuAgencyTypeService" });

export class KmuAgencyTypeService {
  async synchronizeTypes(db: PrismaClient, typeNames: string[]): Promise<Map<string, number>> {
    const uniqueTypeNames = Array.from(new Set(typeNames));

    for (const typeName of uniqueTypeNames) {
      const slug = slugify(typeName);
      await db.agencyType.upsert({
        where: { slug },
        update: {},
        create: {
          name: typeName,
          slug,
        },
      });
    }

    logger.info("All AgencyTypes successfully synchronized");

    const dbTypes = await db.agencyType.findMany();
    return new Map<string, number>(dbTypes.map((t) => [t.name, t.id]));
  }
}
