import { trpc } from "@/lib/trpc/client";
import { useAuth } from "./useAuth";
import { useSmartPolling } from "./useSmartPolling";

export function useMyBookings() {
  const { user } = useAuth();

  // Smart polling: pauses when page is hidden, resumes when visible
  const pollingOptions = useSmartPolling({
    interval: 10000, // Poll every 10 seconds when page is visible
    enabled: !!user,
    refetchOnForeground: true,
  });

  const { data: bookings, isLoading, error } = trpc.booking.myBookings.useQuery(
    undefined,
    {
      enabled: !!user,
      retry: false,
      ...pollingOptions, // Spread smart polling options
    }
  );

  return {
    bookings: bookings ?? [],
    isLoading,
    error,
  };
}
