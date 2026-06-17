import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { logger as baseLogger } from "./logger-config.js";

const logger = baseLogger.child({ service: "Swagger" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwaggerDocs = (app: Express): void => {
  try {
    const docPath = path.join(__dirname, "..", "docs", "openapi.json");
    const swaggerDocument = JSON.parse(fs.readFileSync(docPath, "utf8"));

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    logger.info("Swagger UI interactive documentation hooked at /api-docs");
  } catch (error) {
    logger.error("Failed to initialize Swagger documentation");
    logger.debug(error);
  }
};
