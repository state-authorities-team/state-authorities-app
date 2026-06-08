import { KmuImportService } from "./services/kmu-import-service.js";

async function runParser() {
  try {
    console.log(
      `${new Date().toISOString()} : [Parser] Initializing automated live database update...`,
    );

    const importer = new KmuImportService();
    await importer.runAutomatedLiveImport();

    console.log(
      `${new Date().toISOString()} : [Parser] Success! The database registry has been synchronized with the live KMU portal.`,
    );
  } catch (_globalError) {
    console.error(
      `${new Date().toISOString()} : [Parser] Pipeline execution aborted due to an error in one of the layers.`,
    );
  }
}

runParser().catch(console.error);
