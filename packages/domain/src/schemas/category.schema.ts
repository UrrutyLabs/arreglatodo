import { z } from "zod";
import { categorySchema } from "../enums";

/**
 * Category metadata schema
 * Contains UI/display information for categories
 */
export const categoryMetadataSchema = z.object({
  id: z.string(),
  category: categorySchema,
  displayName: z.string(),
  iconName: z.string().nullable(),
  description: z.string().nullable(),
  displayOrder: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CategoryMetadata = z.infer<typeof categoryMetadataSchema>;

/**
 * Category metadata list schema
 */
export const categoryMetadataListSchema = z.array(categoryMetadataSchema);
