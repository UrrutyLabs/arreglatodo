import { z } from "zod";

/**
 * Service categories available in the marketplace
 */
export enum Category {
  PLUMBING = "plumbing",
  ELECTRICAL = "electrical",
  CLEANING = "cleaning",
  HANDYMAN = "handyman",
  PAINTING = "painting",
}

/**
 * Booking status lifecycle
 */
export enum BookingStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * Zod schema for Category enum
 */
export const categorySchema = z.nativeEnum(Category);

/**
 * Zod schema for BookingStatus enum
 */
export const bookingStatusSchema = z.nativeEnum(BookingStatus);

/**
 * Pro (service provider) profile schema
 */
export const proSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  hourlyRate: z.number().positive(),
  categories: z.array(categorySchema),
  serviceArea: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).default(0),
  isApproved: z.boolean().default(false),
  isSuspended: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Pro = z.infer<typeof proSchema>;

/**
 * Booking schema
 */
export const bookingSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  proId: z.string(),
  category: categorySchema,
  description: z.string().min(1),
  status: bookingStatusSchema,
  scheduledAt: z.date(),
  completedAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  hourlyRate: z.number().positive(),
  estimatedHours: z.number().positive(),
  totalAmount: z.number().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Booking = z.infer<typeof bookingSchema>;

/**
 * Review schema
 */
export const reviewSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  clientId: z.string(),
  proId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date(),
});

export type Review = z.infer<typeof reviewSchema>;

/**
 * Client (customer) schema
 */
export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Client = z.infer<typeof clientSchema>;
