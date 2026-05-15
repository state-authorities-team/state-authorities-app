import type { Request, Response } from "express";
import * as agencyService from "../services/agency-service.js";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const data = await agencyService.getAll();
    res.status(200).json({
      success: true,
      codeStatus: 200,
      data: data,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`${err.message}`);
    }
    res.status(500).json({
      success: false,
      codeStatus: 500,
      message: "Internal server error",
    });
  }
};
