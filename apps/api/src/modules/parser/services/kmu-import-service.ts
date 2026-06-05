import prisma from "../../../configs/db-config.js";
import type { ParsedAgencyRow } from "../types/kmu-types.js";
import { KmuAgencyDataService } from "./kmu-agency-data-service.js";
import { KmuAgencyTypeService } from "./kmu-agency-type-service.js";

export class KmuImportService {
  private readonly typeService = new KmuAgencyTypeService();
  private readonly agencyDataService = new KmuAgencyDataService();

  async seedFromCsv(records: ParsedAgencyRow[]): Promise<void> {
    console.log(
      `${new Date().toISOString()} : [Parser][ImportService] Start import pipeline for ${records.length} records`,
    );

    await prisma.$transaction(async (tx) => {
      const typeNames = records.map((r) => r.typeName);
      const typeMap = await this.typeService.synchronizeTypes(tx, typeNames);

      console.log(
        `${new Date().toISOString()} : [Parser][ImportService] Starting agency synchronization...`,
      );

      const importedCount = await this.agencyDataService.synchronizeAgencies(tx, records, typeMap);

      console.log(
        `${new Date().toISOString()} : [Parser][ImportService] Import execution context finished! Successfully synced ${importedCount} agencies`,
      );
    });
  }
}
