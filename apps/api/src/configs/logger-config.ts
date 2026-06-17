import "dotenv/config";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, json, colorize, printf, errors } = format;

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const devFormat = printf(({ level, message, timestamp, stack, service }) => {
  const serviceTag = service ? `\x1b[36m[${service}]\x1b[0m ` : "";
  return `${timestamp} [${level}]: ${serviceTag}${stack || message}`;
});

export const logger = createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true })),
  transports: [
    process.env.NODE_ENV === "production"
      ? new transports.Console({
          format: combine(json()),
        })
      : new transports.Console({
          format: combine(colorize({ all: true }), devFormat),
        }),
  ],
});
