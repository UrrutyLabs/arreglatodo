import { trpc } from "@/lib/trpc/client";

/**
 * Hook to list all payouts
 */
export function usePayouts(limit?: number) {
  return trpc.payout.list.useQuery({ limit });
}

/**
 * Hook to get a payout by ID
 */
export function usePayout(payoutId: string) {
  return trpc.payout.get.useQuery({ payoutId });
}

/**
 * Hook to list payable pros
 */
export function usePayablePros() {
  return trpc.payout.listPayablePros.useQuery();
}

/**
 * Hook to create a payout for a pro
 */
export function useCreatePayout() {
  return trpc.payout.createForPro.useMutation();
}

/**
 * Hook to send a payout
 */
export function useSendPayout() {
  return trpc.payout.send.useMutation();
}
