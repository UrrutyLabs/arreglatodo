import { trpc } from "@/lib/trpc/client";
import { PaymentStatus } from "@repo/domain";

/**
 * Hook to list payments with filters
 */
export function usePayments(filters?: {
  status?: PaymentStatus;
  query?: string;
  limit?: number;
}) {
  return trpc.payment.adminList.useQuery({
    status: filters?.status,
    query: filters?.query || undefined,
    limit: filters?.limit || 100,
  });
}

/**
 * Hook to get a payment by ID
 */
export function usePayment(paymentId: string) {
  return trpc.payment.adminById.useQuery({ paymentId });
}

/**
 * Hook to sync payment status
 */
export function useSyncPaymentStatus() {
  return trpc.payment.syncStatus.useMutation();
}
