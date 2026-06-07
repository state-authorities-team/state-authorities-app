import type { z } from "zod";
import type { getAgencyQuerySchema } from "../schemas/agency.schema.js";

export type getAgencyQuery = z.infer<typeof getAgencyQuerySchema>;
