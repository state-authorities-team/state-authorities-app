import argon2 from "argon2";
import prisma from "../configs/db-config.js";
import ApiError from "../errors/ApiError.js";
import type { RegistrationInput } from "../schemas/auth-schema.js";

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
