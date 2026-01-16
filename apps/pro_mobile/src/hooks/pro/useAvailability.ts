import { trpc } from "@lib/trpc/client";

interface UseAvailabilityReturn {
  isAvailable: boolean;
  isLoading: boolean;
}

/**
 * Hook to read pro availability state.
 * The backend computes isAvailable from the Availability array (has slots = available).
 * For editing availability, use useAvailabilitySlots instead.
 */
export function useAvailability(): UseAvailabilityReturn {
  // Fetch pro profile to get current availability state
  const { data: pro, isLoading } = trpc.pro.getMyProfile.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Get availability from pro profile
  // The backend computes isAvailable from the Availability array (has slots = available)
  const isAvailable = pro?.isAvailable ?? false;

  return {
    isAvailable,
    isLoading,
  };
}
