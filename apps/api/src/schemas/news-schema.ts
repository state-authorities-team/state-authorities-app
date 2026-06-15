import { z } from "zod";

export const getNewsQuerySchema = z.object({
  page: z.coerce
    .number("Must be a number")
    .int("Must be an integer number")
    .positive("Must be a positive value")
    .default(1),
  limit: z.coerce
    .number("Must be a number")
    .int("Must be an integer number")
    .positive("Must be a positive value")
    .default(10),
});

export type GetNewsQuerySchema = z.infer<typeof getNewsQuerySchema>;
