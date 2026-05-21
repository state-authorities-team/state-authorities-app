import type { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError.js";

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
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
