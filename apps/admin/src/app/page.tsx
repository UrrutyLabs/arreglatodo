"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoadingState } from "@/components/auth/AuthLoadingState";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/admin");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return <AuthLoadingState />;
}
