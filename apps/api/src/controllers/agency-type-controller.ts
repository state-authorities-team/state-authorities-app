import type { Request, Response } from "express";
import { logger as baseLogger } from "../configs/logger-config.js";
import ApiError from "../errors/api-error.js";
import asyncHandler from "../middlewares/async-handler.js";
import * as agencyTypeService from "../services/agency-type-service.js";
import { buildExportTimestamp } from "../utils/time.js";

const logger = baseLogger.child({ service: "AgencyTypesImport" });

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const data = await agencyTypeService.getAll();
  res.status(200).json({
    success: true,
    count: data.length,
    total: data.length,
    totalPages: 1,
    currentPage: 1,
    data,
  });
});

export const exportCsv = asyncHandler(async (_req: Request, res: Response) => {
  const csvBuffer = await agencyTypeService.exportCsv();
  const timestamp = buildExportTimestamp();

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="agency_types_${timestamp}.csv"`);
  res.status(200).send(csvBuffer);
});

export const importFromCsv = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  logger.info(`User ${userId} initiated CSV types import`);

  try {
    if (!req.file) {
      throw ApiError.badRequest("File was not upload");
    }
    if (req.file.mimetype !== "text/csv") {
      throw ApiError.badRequest("Only CSV files are allowed");
    }

    const result = await agencyTypeService.importAgencyTypesFromCsv(req.file.buffer);

    logger.debug(
      `CSV file metadata: name=${req.file.originalname}, size=${req.file.size} bytes, rows=${result.totalRows}`,
    );

    if (result.skipped > 0) {
      logger.warn(
        `CSV import detected ${result.skipped} invalid rows or partially broken column structures skipped during parsing`,
      );
    }

    res.status(200).json({
      success: true,
      message: "CSV file was imported successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Critical error during CSV types import", error);
    throw error;
  }
});
