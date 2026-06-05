import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z.email("Invalid email address").trim(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;
