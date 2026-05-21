import type { Request, Response } from "express";
import * as agencyService from "../services/agency-service.js";

export const getAll = async (_req: Request, res: Response) => {
  const data = await agencyService.getAll();

  res.status(200).json({
    success: true,
    codeStatus: 200,
    data,
  });
};
