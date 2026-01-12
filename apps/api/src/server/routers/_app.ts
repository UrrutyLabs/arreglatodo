import { router, publicProcedure } from "../trpc";
import { bookingRouter } from "./booking.router";
import { proRouter } from "./pro.router";
import { authRouter } from "./auth.router";
import { reviewRouter } from "./review.router";
import { paymentRouter } from "./payment.router";
import { proService } from "../services/pro.service";
import { clientSearchProsInputSchema } from "@repo/domain";

export const appRouter = router({
  health: router({
    ping: publicProcedure.query(() => {
      return {
        ok: true,
        time: new Date(),
      };
    }),
  }),
  auth: authRouter,
  booking: bookingRouter,
  pro: proRouter,
  review: reviewRouter,
  payment: paymentRouter,
  client: router({
    searchPros: publicProcedure
      .input(clientSearchProsInputSchema)
      .query(async ({ input }) => {
        // Get all pros and filter
        const allPros = await proService.getAllPros();
        
        // Filter by category if provided
        const filtered = allPros.filter((pro) => {
          if (!pro.isApproved || pro.isSuspended) return false;
          if (input.category && !pro.categories.includes(input.category)) {
            return false;
          }
          return true;
        });

        // TODO: Filter by date/time when availability system is ready
        // For now, return all matching pros
        
        return filtered;
      }),
  }),
});

export type AppRouter = typeof appRouter;
