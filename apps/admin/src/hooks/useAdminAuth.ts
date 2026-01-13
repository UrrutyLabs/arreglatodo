import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { trpc } from "@/lib/trpc/client";
import { Role } from "@repo/domain";

/**
 * Hook to check if user is authenticated and has admin role
 * Redirects to login if not authenticated
 * Shows access denied if not admin
 */
export function useAdminAuth() {
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const { data: me, isLoading: meLoading } = trpc.auth.me.useQuery(undefined, {
    enabled: !!session,
    retry: false,
  });

  const isLoading = authLoading || meLoading;
  const isAuthenticated = !!user && !!session;
  const isAdmin = me?.role === Role.ADMIN;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return {
    isLoading,
    isAuthenticated,
    isAdmin,
    user,
    session,
  };
}
