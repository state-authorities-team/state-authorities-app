import type { CookieOptions, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { loginUser, registerUser } from "../services/auth-service.js";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

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
  res.cookie("token", token, { ...cookieOptions, maxAge: expiresInSeconds * 1000 });

  return res.status(200).json({
    success: true,
    data: { id: user.id, email: user.email, role: user.role },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
  res.status(200).json({
    success: true,
    message: "Logout completed",
  });
});
