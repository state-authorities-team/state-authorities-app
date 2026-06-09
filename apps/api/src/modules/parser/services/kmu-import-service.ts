import prisma from "../../../configs/db-config.js";
import { KmuAgencyDataService } from "./kmu-agency-data-service.js";
import { KmuAgencyTypeService } from "./kmu-agency-type-service.js";
import { KmuParserService } from "./kmu-parser-service.js";
import { KmuScraperService } from "./kmu-scraper-service.js";

export class KmuImportService {
  private readonly scraperService = new KmuScraperService();
  private readonly parserService = new KmuParserService();
  private readonly typeService = new KmuAgencyTypeService();
  private readonly agencyDataService = new KmuAgencyDataService();

  async runAutomatedLiveImport(): Promise<number> {
    console.log(
      `${new Date().toISOString()} : [Parser][ImportService] Initializing automated streaming pipeline`,
    );

    try {
      const html = await this.scraperService.fetchCatalogHtml();
      const records = this.parserService.parseCatalog(html);

      if (records.length === 0) {
        console.warn("[Parser][ImportService] Dataset is empty. Aborting update.");
        return 0;
      }

      const typeNames = records.map((r) => r.typeName);
      const typeMap = await this.typeService.synchronizeTypes(prisma, typeNames);

      const importedCount = await this.agencyDataService.synchronizeAgencies(
        prisma,
        records,
        typeMap,
      );

      console.log(
        `${new Date().toISOString()} : [Parser][ImportService] Successfully synced ${importedCount} elements.`,
      );
      return importedCount;
    } catch (error) {
      console.error("[Parser][ImportService] Critical failure inside seeding loop:", error);
      throw error;
    }
  }
}
