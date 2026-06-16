import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwaggerDocs = (app: Express): void => {
  try {
    const docPath = path.join(__dirname, "..", "docs", "openapi.json");
    const swaggerDocument = JSON.parse(fs.readFileSync(docPath, "utf8"));

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    console.log(
      `${new Date().toISOString()} : [Infrastructure] Swagger UI interactive documentation hooked at /api-docs`,
    );
  } catch (error) {
    console.error(
      `${new Date().toISOString()} : [Infrastructure ERROR] Failed to initialize Swagger documentation:`,
      error,
    );
  }
};
