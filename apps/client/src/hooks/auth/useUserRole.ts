import { trpc } from "@/lib/trpc/client";
import { useAuth } from "./useAuth";
import type { Role } from "@repo/domain";

/**
 * Hook to fetch current user's role
 * Only fetches when user is authenticated
 * Returns role, loading state, and error
 */
export function useUserRole() {
  const { user } = useAuth();

  const { data: userInfo, isLoading, error } = trpc.auth.me.useQuery(undefined, {
    enabled: !!user, // Only fetch when user is authenticated
    retry: false,
  });

  return {
    role: userInfo?.role as Role | null | undefined,
    isLoading,
    error,
  };
}
