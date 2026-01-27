import { z } from "zod";
import { categorySchema } from "../enums";

/**
 * Subcategory schema
 * Represents a subcategory within a category
 */
export const subcategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: categorySchema,
  imageUrl: z.string().nullable(),
  description: z.string().nullable(),
  displayOrder: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subcategory = z.infer<typeof subcategorySchema>;

/**
 * Subcategory list schema
 */
export const subcategoryListSchema = z.array(subcategorySchema);
