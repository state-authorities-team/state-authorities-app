import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError.js";
import type { JwtPayload } from "../types/jwt-types.js";

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

export const checkRole = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(ApiError.unauthorized("Authentication context missing"));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(ApiError.forbidden("Access denied. You do not have the required permissions."));
      return;
    }
    next();
  };
};
