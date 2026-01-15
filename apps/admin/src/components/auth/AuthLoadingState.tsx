"use client";

import { Loader2 } from "lucide-react";
import { Text } from "@repo/ui";

/**
 * Presentational component for authentication loading state
 * Pure UI component - no logic, just renders loading state
 */
export function AuthLoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <Text variant="body" className="text-muted">
          Verificando autenticación...
        </Text>
      </div>
    </div>
  );
}
