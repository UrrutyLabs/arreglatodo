"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { useUserRole } from "@/hooks/auth";
import { Role } from "@repo/domain";
import { AuthLoadingState } from "@/components/auth/AuthLoadingState";

interface ProLandingGuardProps {
  children: ReactNode;
}

/**
 * Guard for pro landing page
 * - Allows unauthenticated users (show landing page)
 * - Redirects authenticated CLIENT users to /
 * - Redirects authenticated PRO users to /pro/download-app
 */
export function ProLandingGuard({ children }: ProLandingGuardProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: isLoadingRole } = useUserRole();

  useEffect(() => {
    // Still loading, wait
    if (authLoading || (user && isLoadingRole)) {
      return;
    }

    // If user is authenticated, check role and redirect accordingly
    if (user) {
      if (role === Role.CLIENT) {
        // CLIENT user -> redirect to home
        router.replace("/");
        return;
      }
      if (role === Role.PRO) {
        // PRO user -> redirect to download app
        router.replace("/pro/download-app");
        return;
      }
    }

    // Not authenticated -> allow access (show landing page)
  }, [user, role, authLoading, isLoadingRole, router]);

  // Show loading while checking
  if (authLoading || (user && isLoadingRole)) {
    return <AuthLoadingState />;
  }

  // If user is CLIENT or PRO, don't render (redirect will happen)
  if (user && (role === Role.CLIENT || role === Role.PRO)) {
    return null;
  }

  // Allow access for unauthenticated users
  return <>{children}</>;
}
