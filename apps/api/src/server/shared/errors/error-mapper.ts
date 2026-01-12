import { TRPCError } from "@trpc/server";
import {
  InvalidBookingStateError,
  UnauthorizedBookingActionError,
  BookingNotFoundError,
} from "@modules/booking/booking.errors";
import {
  BookingNotCompletedError,
  ReviewAlreadyExistsError,
  UnauthorizedReviewError,
} from "@modules/review/review.errors";

/**
 * Maps domain errors to tRPC errors
 */
export function mapDomainErrorToTRPCError(error: unknown): TRPCError {
  if (error instanceof InvalidBookingStateError) {
    return new TRPCError({
      code: "BAD_REQUEST",
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedBookingActionError) {
    return new TRPCError({
      code: "FORBIDDEN",
      message: error.message,
    });
  }

  if (error instanceof BookingNotFoundError) {
    return new TRPCError({
      code: "NOT_FOUND",
      message: error.message,
    });
  }

  if (error instanceof BookingNotCompletedError) {
    return new TRPCError({
      code: "BAD_REQUEST",
      message: error.message,
    });
  }

  if (error instanceof ReviewAlreadyExistsError) {
    return new TRPCError({
      code: "CONFLICT",
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedReviewError) {
    return new TRPCError({
      code: "FORBIDDEN",
      message: error.message,
    });
  }

  // Generic error fallback
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: error instanceof Error ? error.message : "An error occurred",
  });
}
