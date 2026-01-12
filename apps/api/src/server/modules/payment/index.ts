/**
 * Payment module exports
 */
export { getPaymentProviderClient } from "./registry";
export type { PaymentProviderClient } from "./provider";

// Re-export PaymentServiceFactory from container module for convenience
export type { PaymentServiceFactory } from "@/server/container/modules/payment.module";
