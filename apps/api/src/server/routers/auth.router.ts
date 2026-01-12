import { router, protectedProcedure } from "@infra/trpc";

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.actor.id,
      role: ctx.actor.role,
    };
  }),
});
