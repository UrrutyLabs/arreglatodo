/**
 * Money type (amount in minor units, e.g., cents)
 */
export type Money = {
  amount: number; // minor units
  currency: string;
};

/**
 * Payout destination information
 */
export type PayoutDestination = {
  method: "BANK_TRANSFER";
  bankName?: string;
  bankAccountNumber?: string;
  fullName?: string;
  documentId?: string;
};

/**
 * Result of creating a payout with provider
 */
export interface CreatePayoutResult {
  provider: string; // Provider identifier (e.g., "MANUAL", "BANK_TRANSFER")
  providerReference: string; // Provider-specific reference (e.g., "manual:<id>", "bank:<id>")
}

/**
 * Payout provider client interface
 * Implementations should be provider-specific (e.g., ManualClient, BankTransferClient)
 */
export interface PayoutProviderClient {
  /**
   * Create a payout with the provider
   * @param input - Payout details including money amount and destination
   * @param reference - Internal reference (payout ID) for tracking
   * @returns Provider reference for the created payout
   */
  createPayout(input: {
    money: Money;
    destination: PayoutDestination;
    reference: string;
  }): Promise<CreatePayoutResult>;
}
