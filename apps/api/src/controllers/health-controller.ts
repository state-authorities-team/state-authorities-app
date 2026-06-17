import type { Request, Response } from "express";
import prisma from "../configs/db-config.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const check = asyncHandler(async (_req: Request, res: Response) => {
  try {
    // Test database connection by executing a fast query
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: "UP",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: "HEALTHY",
      },
    });
  } catch (error) {
    console.error("[HealthCheck ERROR] Database connection failed:", error);

    res.status(503).json({
      success: false,
      status: "DOWN",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: "UNHEALTHY",
      },
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
