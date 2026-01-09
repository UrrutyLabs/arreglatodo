import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc/client";

interface UseAvailabilityReturn {
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  toggleAvailability: () => Promise<void>;
  isSaving: boolean;
}

/**
 * Hook to manage pro availability state.
 * Fetches current availability and provides toggle function.
 */
export function useAvailability(): UseAvailabilityReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement pro.getMyProfile or pro.getAvailability endpoint
  // For now, using local state
  const mockIsAvailable = false;
  const mockIsLoading = false;

  // Use real query if endpoint exists, otherwise use mock
  // const { data: pro, isLoading: proLoading } = trpc.pro.getMyProfile.useQuery();

  const setAvailabilityMutation = trpc.pro.setAvailability.useMutation({
    onSuccess: () => {
      setError(null);
      // Refetch pro data if needed
    },
    onError: (err) => {
      setError(err.message || "Error al actualizar disponibilidad");
    },
  });

  // Initialize availability state
  useEffect(() => {
    // TODO: Fetch current availability from API
    setIsAvailable(mockIsAvailable);
    setIsLoading(mockIsLoading);
  }, []);

  const toggleAvailability = async () => {
    const newAvailability = !isAvailable;
    setError(null);
    
    try {
      await setAvailabilityMutation.mutateAsync({
        isAvailable: newAvailability,
      });
      setIsAvailable(newAvailability);
    } catch (err) {
      // Error handled by mutation
      throw err;
    }
  };

  return {
    isAvailable: isLoading ? mockIsAvailable : isAvailable,
    isLoading: isLoading,
    error,
    toggleAvailability,
    isSaving: setAvailabilityMutation.isPending,
  };
}
