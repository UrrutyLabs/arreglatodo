import type { BookingEntity } from "@modules/booking/booking.repo";
import { BookingStatus } from "@repo/domain";

/**
 * Pro profile calculation utilities
 * Pure functions for calculating ProProfile derived/calculated fields
 */

/**
 * Calculate profileCompleted based on avatarUrl and bio presence
 * Profile is completed when both avatarUrl and bio are present
 */
export function calculateProfileCompleted(
  avatarUrl: string | null | undefined,
  bio: string | null | undefined
): boolean {
  return !!(avatarUrl && bio);
}

/**
 * Calculate completedJobsCount from bookings array
 * Counts bookings with status COMPLETED
 */
export function calculateCompletedJobsCount(bookings: BookingEntity[]): number {
  return bookings.filter((b) => b.status === BookingStatus.COMPLETED).length;
}

/**
 * Calculate isTopPro based on completedJobsCount
 * A pro is considered "top pro" if they have >= 10 completed jobs
 */
export function calculateIsTopPro(completedJobsCount: number): boolean {
  return completedJobsCount >= 10;
}

/**
 * Calculate responseTimeMinutes from bookings
 * Note: This requires acceptedAt timestamp on bookings (not yet available in schema)
 * Placeholder for future implementation
 */
export function calculateResponseTimeMinutes(
  bookings: BookingEntity[]
): number | null {
  // TODO: Implement when acceptedAt timestamp is added to Booking schema
  // Calculate average response time (time between booking creation and acceptance)
  return null;
}
