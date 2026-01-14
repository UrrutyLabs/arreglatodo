"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AccessDeniedScreen } from "@/components/layout/AccessDeniedScreen";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, isAdmin } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAdminAuth will redirect to login
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
