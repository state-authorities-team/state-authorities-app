import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logger as baseLogger } from "../configs/logger-config.js";
import ApiError from "../errors/api-error.js";

const logger = baseLogger.child({ service: "GlobalErrorHandler" });

type PrismaLikeError = Error & {
  code?: string;
};

const isPrismaLikeError = (err: unknown): err is PrismaLikeError => {
  return err instanceof Error && typeof (err as PrismaLikeError).code === "string";
};

const errorHandlerMiddleware: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    logger.warn(`[Client 4xx] ${err.statusCode} - ${err.message}`, {
      statusCode: err.statusCode,
      errors: err.errors,
    });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });
  }

  if (isPrismaLikeError(err)) {
    if (err.code === "P2025") {
      logger.warn(`[Prisma 404] Record not found (P2025): ${err.message}`);
      return res.status(404).json({
        success: false,
        message: "Resource not found",
        statusCode: 404,
      });
    }

    if (err.code === "P2002") {
      logger.warn(`[Prisma 409] Unique constraint validation failed (P2002): ${err.message}`);
      return res.status(409).json({
        success: false,
        message: "Resource already exists",
        statusCode: 409,
      });
    }
  }

  const errorObject = err instanceof Error ? err : new Error(String(err));

  logger.error(`[Server 500] Unhandled Runtime Exception: ${errorObject.message}`, errorObject);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    statusCode: 500,
  });
};

export default errorHandlerMiddleware;
