import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import ApiError from "../errors/ApiError.js";

export const validateQuery =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw ApiError.badRequest("Validation failed", errors);
    }

    res.locals.validatedQuery = result.data;

    next();
  };
