import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const token_router = createTRPCRouter({
  create: protectedProcedure.mutation(() => {
    return "todo";
  }),
});
