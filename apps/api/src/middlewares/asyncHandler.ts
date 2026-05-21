import type { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const asyncHandler = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
