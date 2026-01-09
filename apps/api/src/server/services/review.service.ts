import { reviewRepository } from "../repositories/review.repo";
import { bookingRepository } from "../repositories/booking.repo";
import type { ReviewCreateInput, ReviewCreateOutput } from "@repo/domain";
import type { Actor } from "../auth/roles";
import { Role } from "@repo/domain";

/**
 * Review service
 * Contains business logic for review operations
 */
export class ReviewService {
  /**
   * Create a review for a completed booking
   * Business rules:
   * - Booking must exist and be completed
   * - Booking must belong to the client making the review
   * - Booking must not already have a review
   */
  async createReview(
    actor: Actor,
    input: ReviewCreateInput
  ): Promise<ReviewCreateOutput> {
    // Authorization: Only clients can create reviews
    if (actor.role !== Role.CLIENT) {
      throw new Error("Only clients can create reviews");
    }

    // Get booking
    const booking = await bookingRepository.findById(input.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Verify booking belongs to client
    if (booking.clientUserId !== actor.id) {
      throw new Error("Booking does not belong to this client");
    }

    // Verify booking is completed
    if (booking.status !== "completed") {
      throw new Error("Can only review completed bookings");
    }

    // Check if review already exists
    const existingReview = await reviewRepository.findByBookingId(input.bookingId);
    if (existingReview) {
      throw new Error("Review already exists for this booking");
    }

    // Create review
    const review = await reviewRepository.create({
      bookingId: input.bookingId,
      rating: input.rating,
      comment: input.comment,
    });

    // Adapt to domain type
    return {
      id: review.id,
      bookingId: review.bookingId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }
}

export const reviewService = new ReviewService();
