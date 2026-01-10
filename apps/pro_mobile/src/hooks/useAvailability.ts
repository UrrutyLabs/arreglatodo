import { useMemo } from "react";
import { trpc } from "../lib/trpc/client";

export function useAvailability() {
  const { data: pro, isLoading, error, refetch } = (trpc as any).pro.getMyProfile.useQuery();

  const isAvailable = useMemo(() => {
    return pro ? pro.isApproved && !pro.isSuspended : false;
  }, [pro]);

  const setAvailability = (trpc as any).pro.setAvailability.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const toggleAvailability = () => {
    setAvailability.mutate({ isAvailable: !isAvailable });
  };

  return {
    isAvailable,
    isLoading,
    error: error?.message || null,
    toggleAvailability,
    isSaving: setAvailability.isPending,
  };
}
