import { writeToCsv } from "../../utils/csv-writer.js";
import { PARSER_CONFIG } from "./config/parser-config.js";
import { KmuImportService } from "./services/kmu-import-service.js";
import { KmuParserService } from "./services/kmu-parser-service.js";
import { KmuScraperService } from "./services/kmu-scraper-service.js";

async function runParser() {
  try {
    console.log(`${new Date().toISOString()} : [Parser] Scrapping is starting...`);

    const scrapper = new KmuScraperService(PARSER_CONFIG.htmlPath);
    const parser = new KmuParserService();

    const html = await scrapper.fetchCatalogHtml();
    const agencies = parser.parseCatalog(html);

    await writeToCsv(PARSER_CONFIG.csvPath, agencies);

    console.log(
      `${new Date().toISOString()} : [Parser] Successfully! Saved ${agencies.length} in file ${PARSER_CONFIG.csvPath}`,
    );

    const importer = new KmuImportService();
    await importer.seedFromCsv(agencies);
  } catch (_globalError) {
    console.error(
      `${new Date().toISOString()} : [Parser] Pipeline execution aborted due to an error in one of the layers.`,
    );
  }
}

runParser().catch(console.error);
