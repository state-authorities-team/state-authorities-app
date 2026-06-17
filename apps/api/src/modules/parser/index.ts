import { logger as baseLogger } from "../../configs/logger-config.js";
import { KmuImportService } from "./services/kmu-import-service.js";

const logger = baseLogger.child({ service: "KmuParser" });

async function runParser() {
  try {
    logger.debug("Initializing automated live database update...");

    const importer = new KmuImportService();
    await importer.runAutomatedLiveImport();

    logger.info("Success! The database registry has been synchronized with the live KMU portal.");
  } catch (error) {
    logger.error("Pipeline execution aborted due to an error in one of the layers.", error);
    throw error;
  }
}

runParser().catch((fatalError) => {
  logger.error("Fatal uncaught exception during parser bootstrap:", fatalError);
  process.exit(1);
});
