import { z } from "zod";

export const createAgencyTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z.string().min(1, "Slug must not be empty").max(255, "Slug is too long").optional(),
});

export type CreateAgencyTypeSchema = z.infer<typeof createAgencyTypeSchema>;
