import { trpc } from "@/lib/trpc/client";
import { useAuth } from "./useAuth";

export function useMyBookings() {
  const { user } = useAuth();

  const { data: bookings, isLoading, error } = trpc.booking.myBookings.useQuery(
    undefined,
    {
      enabled: !!user,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    bookings: bookings ?? [],
    isLoading,
    error,
  };
}
