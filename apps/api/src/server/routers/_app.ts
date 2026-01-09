import { router, publicProcedure } from "../trpc";

export const appRouter = router({
  health: router({
    ping: publicProcedure.query(() => {
      return {
        ok: true,
        time: new Date(),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
