import type { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { getNewsByAgency } from "../services/news-service.js";

export const getNewsByAgencyHandler = asyncHandler(async (req: Request, res: Response) => {
  const validatedQuery = res.locals.validatedQuery;

  const result = await getNewsByAgency(Number(req.params.id), {
    page: validatedQuery.page,
    limit: validatedQuery.limit,
  });

  return res.status(200).json({
    success: true,
    count: result.count,
    total: result.total,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: result.data,
  });
});
