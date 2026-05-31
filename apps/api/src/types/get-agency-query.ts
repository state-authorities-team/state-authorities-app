import type { z } from "zod";
import { getAgencyQuerySchema } from "../schemas/agency.schema.js";

export type getAgencyQuery = z.infer<typeof getAgencyQuerySchema>;
