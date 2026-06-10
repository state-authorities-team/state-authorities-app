import type { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as agencyTypeService from "../services/agency-type-service.js";
import { buildExportTimestamp } from "../utils/time.js";

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
