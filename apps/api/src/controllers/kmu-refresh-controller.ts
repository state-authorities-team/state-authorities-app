import type { Request, Response } from "express";
import ApiError from "../errors/ApiError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { KmuImportService } from "../modules/parser/services/kmu-import-service.js";

class KmuRefreshController {
  private isImporting = false;
  private readonly importService = new KmuImportService();

  handle = asyncHandler(async (_req: Request, res: Response) => {
    if (this.isImporting) {
      throw ApiError.tooManyRequests(
        "KMU import pipeline is already running. Please try again later.",
      );
    }

    this.isImporting = true;
    try {
      const syncedCount = await this.importService.runAutomatedLiveImport();
      res.status(200).json({
        success: true,
        data: { syncedCount },
      });
    } finally {
      this.isImporting = false;
    }
  });
}

export const kmuRefreshController = new KmuRefreshController();
