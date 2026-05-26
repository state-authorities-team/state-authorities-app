import type { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import * as agencyTypeService from "../services/agency-type-service.js";

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
