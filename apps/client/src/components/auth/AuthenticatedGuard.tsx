"use client";

import { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/auth";
import { AuthLoadingState } from "./AuthLoadingState";
import type { Role } from "@repo/domain";

interface AuthenticatedGuardProps {
  children: ReactNode;
  returnUrl?: string;
  maxWidth?: string;
  requiredRole?: Role; // Optional role requirement
}

/**
 * Container component that guards authenticated routes
 * Handles authentication check and optional role-based access control
 * Renders children only when user is authenticated and has the required role (if specified)
 * 
 * @param requiredRole - Optional role requirement (CLIENT, PRO, ADMIN)
 *                       If provided, only users with matching role can access
 */
export function AuthenticatedGuard({
  children,
  returnUrl,
  maxWidth,
  requiredRole,
}: AuthenticatedGuardProps) {
  const { isAuthenticated, isLoading } = useRequireAuth({
    redirectTo: "/login",
    returnUrl,
    requiredRole,
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoadingState maxWidth={maxWidth} />;
  }

  // If not authenticated, useRequireAuth will handle redirect
  // Return null as safety check (redirect should happen in hook)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
