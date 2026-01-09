import { z } from "zod";
import { categorySchema } from "../enums";

/**
 * Client search pros input schema
 */
export const clientSearchProsInputSchema = z.object({
  category: categorySchema.optional(),
  date: z.date().optional(),
  time: z.string().optional(), // "HH:MM" format
});

export type ClientSearchProsInput = z.infer<typeof clientSearchProsInputSchema>;
