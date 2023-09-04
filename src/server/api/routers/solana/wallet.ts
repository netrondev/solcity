import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { GetPublicKeyForUser } from "./GetPublicKeyForUser";

export const solana_wallet_router = createTRPCRouter({
  account: protectedProcedure.query(async ({ ctx }) => {
    const pub = await GetPublicKeyForUser({ user_id: ctx.session.user.id });
    return { publicKey: pub.publicKey };
  }),
});
