import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        statusCode: 400,
        errors,
      });

      return;
    }

    req.body = result.data;

    next();
  };
