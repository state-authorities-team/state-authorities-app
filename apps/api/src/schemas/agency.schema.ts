import { z } from "zod";

export const createAgencySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),

  typeId: z
    .number({
      error: "typeId must be a number",
    })
    .int("typeId must be integer")
    .positive("typeId must be positive"),

  shortName: z.string().optional(),

  headName: z.string().optional(),

  headTitle: z.string().optional(),

  description: z.string().optional(),

  address: z.string().optional(),

  phone: z.string().optional(),

  email: z.email("Invalid email").optional(),

  website: z.url("Invalid website URL").optional(),

  region: z.string().optional(),
});

export const updateAgencySchema = createAgencySchema.partial();

export const getAgencyQuerySchema = z.object({
  type: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateAgencySchema = z.infer<typeof createAgencySchema>;
