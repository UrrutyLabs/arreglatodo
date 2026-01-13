import type { PayoutProviderClient, CreatePayoutResult } from "../provider";

/**
 * Manual payout provider client (stub)
 * Returns a manual reference for admin-managed payouts
 */
export class ManualClient implements PayoutProviderClient {
  async createPayout(input: {
    money: { amount: number; currency: string };
    destination: { method: "BANK_TRANSFER" };
    reference: string;
  }): Promise<CreatePayoutResult> {
    // Stub implementation: return manual reference
    return {
      provider: "MANUAL",
      providerReference: `manual:${input.reference}`,
    };
  }
}
