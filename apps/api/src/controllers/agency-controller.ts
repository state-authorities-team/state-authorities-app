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

export const create = async (req: Request, res: Response) => {
  try {
    const agency = await agencyService.create(req.body);
    res.status(201).json({ success: true, data: agency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, statusCode: 500, errors: ["Internal server error"] });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);

    const agency = await agencyService.update(id, req.body);
    res.status(200).json({ success: true, data: agency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, statusCode: 500, errors: ["Internal server error"] });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);

    await agencyService.remove(id);
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, statusCode: 500, errors: ["Internal server error"] });
  }
};
