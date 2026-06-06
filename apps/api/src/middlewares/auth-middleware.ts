import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError.js";

type JwtPayload = {
  id: number;
  role: Role;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies.token as string | undefined;

  if (!token) {
    next(ApiError.unauthorized());
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(ApiError.internal("JWT_SECRET is not configured"));
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};
