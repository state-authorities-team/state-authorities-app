import type { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { loginUser, registerUser } from "../services/auth-service.js";

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

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { token, expiresInSeconds, user } = await loginUser(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresInSeconds * 1000,
  });

  return res.status(200).json({
    success: true,
    data: { id: user.id, email: user.email, role: user.role },
  });
});
