import type { PayoutProviderClient, CreatePayoutResult } from "../provider";

/**
 * Bank transfer payout provider client (stub)
 * Returns a bank reference for bank transfer payouts
 */
export class BankTransferStubClient implements PayoutProviderClient {
  async createPayout(input: {
    money: { amount: number; currency: string };
    destination: { method: "BANK_TRANSFER" };
    reference: string;
  }): Promise<CreatePayoutResult> {
    // Stub implementation: return bank reference
    return {
      provider: "BANK_TRANSFER",
      providerReference: `bank:${input.reference}`,
    };
  }
}
