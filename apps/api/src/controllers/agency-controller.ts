import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import * as agencyService from "../services/agency-service.js";

export const getAll = async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await agencyService.getAll({
      type: type as string | undefined,
      search: search as string | undefined,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, statusCode: 500, errors: ["Internal server error"] });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, typeId } = req.body;
    const errors: string[] = [];

    if (!name) {
      errors.push("name is required");
    }
    if (!typeId) {
      errors.push("typeId is required");
    }

    if (errors.length) {
      res.status(400).json({ success: false, statusCode: 400, errors });
      return;
    }

    const agency = await agencyService.create(req.body);
    res.status(201).json({ success: true, data: agency });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      res.status(400).json({ success: false, statusCode: 400, errors: ["Invalid typeId"] });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, statusCode: 500, errors: ["Internal server error"] });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, statusCode: 400, errors: ["Invalid id"] });
      return;
    }

    const agency = await agencyService.update(id, req.body);
    res.status(200).json({ success: true, data: agency });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      res.status(404).json({ success: false, statusCode: 404, errors: ["Agency not found"] });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, statusCode: 500, errors: ["Internal server error"] });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ success: false, statusCode: 400, errors: ["Invalid id"] });
      return;
    }

    await agencyService.remove(id);
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      res.status(404).json({ success: false, statusCode: 404, errors: ["Agency not found"] });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, statusCode: 500, errors: ["Internal server error"] });
  }
};
