import type { PayoutProviderClient } from "./provider";
import { ManualClient } from "./providers/manual.client";
import { BankTransferStubClient } from "./providers/bankTransfer.stub";

/**
 * Payout provider enum (matches Prisma schema)
 */
export type PayoutProvider = "MERCADO_PAGO" | "BANK_TRANSFER" | "MANUAL";

/**
 * Get payout provider client for a specific provider
 * @param provider - The payout provider identifier
 * @returns PayoutProviderClient instance
 */
export function getPayoutProviderClient(
  provider: PayoutProvider
): PayoutProviderClient {
  switch (provider) {
    case "MANUAL":
      return new ManualClient();
    case "BANK_TRANSFER":
      return new BankTransferStubClient();
    case "MERCADO_PAGO":
      // TODO: Implement Mercado Pago payout provider
      throw new Error("Mercado Pago payout provider not yet implemented");
    default:
      throw new Error(`Unknown payout provider: ${provider}`);
  }
}
