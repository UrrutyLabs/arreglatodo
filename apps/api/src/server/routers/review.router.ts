import { router, protectedProcedure } from "../trpc";
import { reviewService } from "../services/review.service";
import {
  reviewCreateInputSchema,
  reviewCreateOutputSchema,
} from "@repo/domain";
import { mapDomainErrorToTRPCError } from "../errors/error-mapper";

export const reviewRouter = router({
  create: protectedProcedure
    .input(reviewCreateInputSchema)
    .output(reviewCreateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await reviewService.createReview(ctx.actor, input);
      } catch (error) {
        throw mapDomainErrorToTRPCError(error);
      }
    }),
});
