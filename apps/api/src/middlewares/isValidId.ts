import type { NextFunction, Request, Response } from "express";

export const isValidId = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      errors: ["Invalid id"],
    });

    return;
  }

  next();
};
