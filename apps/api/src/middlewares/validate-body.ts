import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import ApiError from "../errors/ApiError.js";

export const validateBody =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw ApiError.badRequest("Validation failed", errors);
    }

    req.body = result.data;

    next();
  };
