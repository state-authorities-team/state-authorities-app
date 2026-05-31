import type { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError.js";

export const isValidId = (req: Request, _res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest("Invalid id", ["Invalid id"]);
  }

  next();
};
