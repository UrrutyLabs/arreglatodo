import { router, protectedProcedure } from "../trpc";
import { Role } from "@repo/domain";

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.actor.id,
      role: ctx.actor.role,
    };
  }),
});
