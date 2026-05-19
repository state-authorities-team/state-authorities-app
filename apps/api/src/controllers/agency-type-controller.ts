import type { Request, Response } from "express";
import * as agencyTypeService from "../services/agency-type-service.js";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const data = await agencyTypeService.getAll();
    res.status(200).json({
      success: true,
      count: data.length,
      total: data.length,
      totalPages: 1,
      currentPage: 1,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      errors: ["Internal server error"],
    });
  }
};
