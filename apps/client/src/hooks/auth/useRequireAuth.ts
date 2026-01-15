import { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { useUserRole } from "./useUserRole";
import { Role } from "@repo/domain";
import { logger } from "@/lib/logger";

interface UseRequireAuthOptions {
  redirectTo?: string;
  returnUrl?: string;
  requiredRole?: Role; // Optional role requirement
}

interface UseRequireAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ReturnType<typeof useAuth>["user"];
  requireAuth: <T extends unknown[]>(callback: (...args: T) => void) => (...args: T) => void;
}

/**
 * Hook to require authentication for protected routes or actions
 * Optionally requires a specific role
 * 
 * @param options - Configuration options
 * @param options.redirectTo - Where to redirect if not authenticated (default: '/login')
 * @param options.returnUrl - URL to return to after authentication
 * @param options.requiredRole - Optional role requirement (CLIENT, PRO, ADMIN)
 * @returns Auth state and requireAuth wrapper function
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}): UseRequireAuthReturn {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { redirectTo = "/login", returnUrl, requiredRole } = options;

  // Fetch user role if requiredRole is specified and user is authenticated
  const { role, isLoading: isLoadingRole } = useUserRole();
  const isLoading = loading || (requiredRole && user && isLoadingRole);

  // Determine redirect destination based on role mismatch
  const getRedirectDestination = useCallback(() => {
    if (requiredRole && role) {
      // Role mismatch - redirect based on required role
      if (requiredRole === Role.CLIENT && role === Role.PRO) {
        logger.info("useRequireAuth: PRO user trying to access CLIENT route -> redirect to /pro/download-app");
        // PRO user trying to access CLIENT route -> redirect to download app
        return "/pro/download-app";
      }
      if (requiredRole === Role.PRO && role === Role.CLIENT) {
        // CLIENT user trying to access PRO route -> redirect to /my-bookings
        return "/my-bookings";
      }
    }
    // Default redirect (not authenticated or no role requirement)
    return redirectTo;
  }, [requiredRole, role, redirectTo]);

  // Build redirect URL with returnUrl if provided
  const redirectUrl = useMemo(() => {
    const destination = getRedirectDestination();
    if (returnUrl && destination === redirectTo) {
      // Only add returnUrl for default login redirect, not role-based redirects
      return `${destination}?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
    return destination;
  }, [getRedirectDestination, returnUrl, redirectTo]);

  // Check authentication and role requirements
  useEffect(() => {
    if (isLoading) {
      return; // Still loading, wait
    }

    // Not authenticated -> redirect to login
    if (!user) {
      router.push(redirectUrl);
      return;
    }

    // If role is required, check if it matches
    if (requiredRole) {
      // If role is still loading, wait (handled by isLoading check above)
      // If role is undefined/null after loading, treat as mismatch
      if (role === undefined || role === null || role !== requiredRole) {
        // Role mismatch or missing -> redirect
        router.push(redirectUrl);
        return;
      }
      // Role matches -> allow access
    }
  }, [isLoading, user, role, requiredRole, router, redirectUrl]);

  /**
   * Wraps a callback function to require authentication before execution
   * If not authenticated or wrong role, redirects immediately
   */
  const requireAuth = useCallback(
    <T extends unknown[]>(callback: (...args: T) => void) => {
      return (...args: T) => {
        if (isLoading) {
          // Still loading, wait
          return;
        }
        if (!user) {
          // Not authenticated, redirect immediately
          router.push(redirectUrl);
          return;
        }
        // Check role if required
        if (requiredRole && role !== requiredRole) {
          // Wrong role, redirect
          router.push(redirectUrl);
          return;
        }
        // Authenticated and correct role, execute callback
        callback(...args);
      };
    },
    [user, role, requiredRole, isLoading, router, redirectUrl]
  );

  // Determine if user is authenticated and has correct role
  const isAuthenticated = useMemo((): boolean => {
    if (!user) {
      return false;
    }
    if (requiredRole) {
      // If role is required, check if it matches
      // If role is null/undefined, treat as not authenticated
      if (role === null || role === undefined || role !== requiredRole) {
        return false;
      }
    }
    return true;
  }, [user, role, requiredRole]);

  return {
    isAuthenticated,
    isLoading: isLoading || isLoadingRole,
    user,
    requireAuth,
  };
}
