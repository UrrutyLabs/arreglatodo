import { trpc } from "@/lib/trpc/client";

/**
 * Hook to list pros with filters
 */
export function usePros(filters?: {
  query?: string;
  status?: "pending" | "active" | "suspended";
  limit?: number;
  cursor?: string;
}) {
  return trpc.pro.adminList.useQuery(filters);
}

/**
 * Hook to get a pro by ID
 */
export function usePro(proProfileId: string) {
  return trpc.pro.adminById.useQuery({ proProfileId });
}
