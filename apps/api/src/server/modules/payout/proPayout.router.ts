import { z } from "zod";
import { router, proProcedure } from "@infra/trpc";
import { container, TOKENS } from "@/server/container";
import { ProPayoutProfileService } from "./proPayoutProfile.service";
import { TRPCError } from "@trpc/server";

// Resolve service from container
const proPayoutProfileService = container.resolve<ProPayoutProfileService>(
  TOKENS.ProPayoutProfileService
);

export const proPayoutRouter = router({
  /**
   * Get the current pro's payout profile
   * Creates profile if it doesn't exist
   */
  getMine: proProcedure.query(async ({ ctx }) => {
    try {
      return await proPayoutProfileService.getOrCreateForPro(ctx.actor);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to get payout profile",
      });
    }
  }),

  /**
   * Update the current pro's payout profile
   * Allows partial updates and recomputes isComplete status
   */
  updateMine: proProcedure
    .input(
      z.object({
        fullName: z.string().nullable().optional(),
        documentId: z.string().nullable().optional(),
        bankName: z.string().nullable().optional(),
        bankAccountNumber: z.string().nullable().optional(),
        bankAccountType: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await proPayoutProfileService.updateForPro(ctx.actor, input);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update payout profile",
        });
      }
    }),
});
