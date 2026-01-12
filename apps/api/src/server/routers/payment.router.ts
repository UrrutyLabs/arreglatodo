import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { PaymentService } from "../services/payment.service";
import { getPaymentProviderClient } from "../payments/registry";
import { PaymentProvider } from "@repo/domain";
import { TRPCError } from "@trpc/server";

/**
 * Create payment service instance with provider from registry
 * The service uses the provider client dynamically based on Payment.provider field
 */
async function createPaymentService(provider: PaymentProvider): Promise<PaymentService> {
  const providerClient = await getPaymentProviderClient(provider);
  return new PaymentService(providerClient, provider);
}

export const paymentRouter = router({
  /**
   * Create a preauthorization for a booking
   * Returns payment ID and checkout URL
   */
  createPreauthForBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .output(
      z.object({
        paymentId: z.string(),
        checkoutUrl: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const paymentService = await createPaymentService(PaymentProvider.MERCADO_PAGO);
        return await paymentService.createPreauthForBooking(ctx.actor, input);
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payment preauthorization",
        });
      }
    }),

  /**
   * Get payment summary for a booking
   * Only accessible by the booking client or admin
   */
  getByBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .output(
      z
        .object({
          id: z.string(),
          status: z.string(),
          amountEstimated: z.number(),
          amountAuthorized: z.number().nullable(),
          amountCaptured: z.number().nullable(),
          checkoutUrl: z.string().nullable(),
          currency: z.string(),
          createdAt: z.date(),
        })
        .nullable()
    )
    .query(async ({ input, ctx }) => {
      try {
        const { paymentRepository } = await import("../repositories/payment.repo");
        const { bookingRepository } = await import("../repositories/booking.repo");

        // Get booking to verify ownership
        const booking = await bookingRepository.findById(input.bookingId);
        if (!booking) {
          return null;
        }

        // Authorization: Only booking client or admin can view payment
        if (ctx.actor.role !== "admin" && booking.clientUserId !== ctx.actor.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only view payments for your own bookings",
          });
        }

        const payment = await paymentRepository.findByBookingId(input.bookingId);
        if (!payment) {
          return null;
        }

        return {
          id: payment.id,
          status: payment.status,
          amountEstimated: payment.amountEstimated,
          amountAuthorized: payment.amountAuthorized,
          amountCaptured: payment.amountCaptured,
          checkoutUrl: payment.checkoutUrl,
          currency: payment.currency,
          createdAt: payment.createdAt,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get payment",
        });
      }
    }),

  /**
   * Sync payment status with provider
   * Admin-only endpoint for manual reconciliation
   */
  syncStatus: adminProcedure
    .input(z.object({ paymentId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { paymentRepository } = await import("../repositories/payment.repo");
        const payment = await paymentRepository.findById(input.paymentId);

        if (!payment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found",
          });
        }

        // Create service instance with the payment's provider
        const service = await createPaymentService(payment.provider);
        await service.syncPaymentStatus(input.paymentId);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to sync payment status",
        });
      }
    }),
});
