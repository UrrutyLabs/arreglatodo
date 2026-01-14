import { trpc } from "@/lib/trpc/client";
import { BookingStatus } from "@repo/domain";

/**
 * Hook to list bookings with filters
 */
export function useBookings(filters?: {
  status?: BookingStatus;
  query?: string;
  limit?: number;
}) {
  return trpc.booking.adminList.useQuery({
    status: filters?.status,
    query: filters?.query || undefined,
    limit: filters?.limit || 100,
  });
}

/**
 * Hook to get a booking by ID
 */
export function useBooking(bookingId: string) {
  return trpc.booking.adminById.useQuery({ bookingId });
}

/**
 * Hook to cancel a booking
 */
export function useCancelBooking() {
  return trpc.booking.cancel.useMutation();
}

/**
 * Hook to force booking status (admin only)
 */
export function useForceBookingStatus() {
  return trpc.booking.adminForceStatus.useMutation();
}
