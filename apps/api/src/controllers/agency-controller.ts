import type { Request, Response } from "express";
import ApiError from "../errors/ApiError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as agencyService from "../services/agency-service.js";
import type { getAgencyQuery } from "../types/get-agency-query.js";

const buildExportTimestamp = () => new Date().toISOString().replace(/[:.]/g, "-");

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const result = await agencyService.getAll(res.locals.validatedQuery as getAgencyQuery);

  res.status(200).json({
    success: true,
    count: result.count,
    total: result.total,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: result.data,
  });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const agency = await agencyService.getById(id);
  res.status(200).json({ success: true, data: agency });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const agency = await agencyService.create(req.body);
  res.status(201).json({ success: true, data: agency });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const agency = await agencyService.update(id, req.body);
  res.status(200).json({ success: true, data: agency });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await agencyService.remove(id);
  res.status(200).json({ success: true, data: null });
});

export const exportCsv = asyncHandler(async (_req: Request, res: Response) => {
  const csvBuffer = await agencyService.exportCsv();
  const timestamp = buildExportTimestamp();

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="agencies_${timestamp}.csv"`);
  res.status(200).send(csvBuffer);
});

export const importFromCsv = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("File was not upload");
  }
  if (req.file.mimetype !== "text/csv") {
    throw ApiError.badRequest("Only CSV files are allowed");
  }

  const result = await agencyService.importAgencyFromCsv(req.file.buffer);

  res.status(200).json({
    success: true,
    message: "CSV file was processed successfully",
    data: result,
  });
});
