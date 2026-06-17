import type { Handler } from "express";
import morgan from "morgan";
import { logger } from "../configs/logger-config.js";

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

const formatString = process.env.NODE_ENV === "production" ? "combined" : "dev";

export const httpLoggerMiddleware: Handler = morgan(formatString, { stream });
