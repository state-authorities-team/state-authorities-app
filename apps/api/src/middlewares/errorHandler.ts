import type { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import ApiError from "../errors/ApiError.js";

type PrismaLikeError = Error & {
  code?: string;
};

const isPrismaLikeError = (err: unknown): err is PrismaLikeError => {
  return err instanceof Error && typeof (err as PrismaLikeError).code === "string";
};

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const e = err as Error;
  console.error(`${new Date().toISOString()} : ${e.name} ${e.message}`);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });
  }

  if (isPrismaLikeError(err)) {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
        statusCode: 404,
      });
    }

    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Resource already exists",
        statusCode: 409,
      });
    }
  }

  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
      statusCode: 500,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    statusCode: 500,
  });
};

export default errorHandler;
