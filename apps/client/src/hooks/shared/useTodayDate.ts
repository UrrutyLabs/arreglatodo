import { useMemo } from "react";

/**
 * Hook to get today's date in YYYY-MM-DD format
 * Useful for date inputs and date comparisons
 * @returns Today's date string in YYYY-MM-DD format
 */
export function useTodayDate(): string {
  return useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);
}
