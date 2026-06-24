import prisma from "../../../configs/db-config.js";
import { logger as baseLogger } from "../../../configs/logger-config.js";
import { KmuAgencyDataService } from "./kmu-agency-data-service.js";
import { KmuAgencyTypeService } from "./kmu-agency-type-service.js";
import { KmuParserService } from "./kmu-parser-service.js";
import { KmuScraperService } from "./kmu-scraper-service.js";

const logger = baseLogger.child({ service: "KmuImportService" });

export class KmuImportService {
  private readonly kmuUrl = "https://www.kmu.gov.ua/catalog";
  private readonly scraperService = new KmuScraperService();
  private readonly parserService = new KmuParserService();
  private readonly typeService = new KmuAgencyTypeService();
  private readonly agencyDataService = new KmuAgencyDataService();

  async runAutomatedLiveImport(): Promise<number> {
    logger.debug("Initializing automated streaming pipeline");

    try {
      const html = await this.scraperService.fetchCatalogHtml(this.kmuUrl);
      const records = this.parserService.parseCatalog(html);

      if (records.length === 0) {
        logger.warn("Dataset is empty. Aborting update.");
        return 0;
      }

      const typeNames = records.map((r) => r.typeName);
      const typeMap = await this.typeService.synchronizeTypes(prisma, typeNames);

      const importedCount = await this.agencyDataService.synchronizeAgencies(
        prisma,
        records,
        typeMap,
      );

      logger.info(`Successfully synced ${importedCount} elements`);
      return importedCount;
    } catch (error) {
      logger.error("Critical failure inside seeding loop:", error);
      throw error;
    }
  }
}
