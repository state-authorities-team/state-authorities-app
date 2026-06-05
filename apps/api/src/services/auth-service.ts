import argon2 from "argon2";
import jwt from "jsonwebtoken";
import prisma from "../configs/db-config.js";
import ApiError from "../errors/ApiError.js";
import type { LoginInput, RegistrationInput } from "../schemas/auth-schema.js";

function parseExpiresInToSeconds(value: string): number {
  const num = parseInt(value, 10);
  if (Number.isNaN(num)) {
    return 7 * 24 * 60 * 60;
  }
  const unit = value.slice(String(num).length);
  switch (unit) {
    case "m":
      return num * 60;
    case "h":
      return num * 3600;
    case "d":
      return num * 86400;
    default:
      return num;
  }
}

export const registerUser = async (data: RegistrationInput) => {
  const uniqueUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (uniqueUser) {
    throw ApiError.badRequest(`User with email ${data.email} already exists`);
  }
  const passwordHash = await argon2.hash(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: passwordHash,
    },
  });
  return user;
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || !(await argon2.verify(user.passwordHash, data.password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw ApiError.internal("JWT_SECRET is not configured");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  const expiresInSeconds = parseExpiresInToSeconds(expiresIn);

  const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn });

  return {
    token,
    expiresInSeconds,
    user: { id: user.id, email: user.email, role: user.role },
  };
};
