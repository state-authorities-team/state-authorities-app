import type { Prisma } from "@prisma/client";
import { slugify } from "../../../utils/slugify.js";

export class KmuAgencyTypeService {
  async synchronizeTypes(
    tx: Prisma.TransactionClient,
    typeNames: string[],
  ): Promise<Map<string, number>> {
    const uniqueTypeNames = Array.from(new Set(typeNames));

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
      `${new Date().toISOString()} : [Parser][TypeService] All AgencyTypes successfully synchronized`,
    );

    const dbTypes = await tx.agencyType.findMany();
    return new Map<string, number>(dbTypes.map((t) => [t.name, t.id]));
  }
}
