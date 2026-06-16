import { z } from "zod";

export const scrapeSelectorsSchema = z.object({
  container: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  date: z.string(),
});

export type ScrapeSelectors = z.infer<typeof scrapeSelectorsSchema>;
