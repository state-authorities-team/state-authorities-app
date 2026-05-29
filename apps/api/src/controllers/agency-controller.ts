import type { Request, Response } from "express";
import ApiError from "../errors/ApiError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as agencyService from "../services/agency-service.js";

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { type, search } = req.query;
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));

  const result = await agencyService.getAll({
    type: type as string | undefined,
    search: search as string | undefined,
    page,
    limit,
  });

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
  const id = parseInt(<string>req.params.id, 10);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id");
  }

  const agency = await agencyService.getById(id);
  res.status(200).json({ success: true, data: agency });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, typeId } = req.body;
  const errors: string[] = [];

  if (!name) {
    errors.push("name is required");
  }
  if (!typeId) {
    errors.push("typeId is required");
  }

  if (errors.length) {
    throw ApiError.badRequest("Validation failed", errors);
  }

  const agency = await agencyService.create(req.body);
  res.status(201).json({ success: true, data: agency });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(<string>req.params.id, 10);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id", ["Invalid id"]);
  }

  const agency = await agencyService.update(id, req.body);
  res.status(200).json({ success: true, data: agency });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(<string>req.params.id, 10);
  if (Number.isNaN(id)) {
    throw ApiError.badRequest("Invalid id", ["Invalid id"]);
  }

  await agencyService.remove(id);
  res.status(200).json({ success: true, data: null });
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
