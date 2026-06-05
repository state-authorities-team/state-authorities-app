import type { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { registerUser } from "../services/auth-service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  return res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});
