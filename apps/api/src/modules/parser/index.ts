import path from "node:path";
import { writeToCsv } from "../../utils/csv-writer.js";
import { KmuImportService } from "./services/kmu-import-service.js";
import { KmuParserService } from "./services/kmu-parser-service.js";
import { KmuScraperService } from "./services/kmu-scraper-service.js";

const OUTPUT_DIRNAME = "storage";
const OUTPUT_CSV_FILENAME = "kmu_agencies.csv";

async function runParser() {
  console.log(`${new Date().toISOString()} : Scrapping is starting...`);

  const scrapper = new KmuScraperService();
  const parser = new KmuParserService();

  const html = await scrapper.fetchCatalogHtml();
  const agencies = parser.parseCatalog(html);

  const outputPath = path.join(process.cwd(), OUTPUT_DIRNAME, OUTPUT_CSV_FILENAME);
  await writeToCsv(outputPath, agencies);

  console.log(
    `${new Date().toISOString()} : Successfully! Saved ${agencies.length} in file ${outputPath}`,
  );

  const importer = new KmuImportService();
  await importer.seedFromCsv(agencies);
}

runParser().catch(console.error);
