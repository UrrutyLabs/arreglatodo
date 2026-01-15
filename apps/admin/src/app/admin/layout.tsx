"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AccessDeniedScreen } from "@/components/layout/AccessDeniedScreen";
import { AuthLoadingState } from "@/components/auth/AuthLoadingState";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, isAdmin } = useAdminAuth();

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (!isAuthenticated) {
    return null; // useAdminAuth will redirect to login
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
