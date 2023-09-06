import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetPublicKeyForUser,
  GetSecretKeypairForUser,
} from "./GetPublicKeyForUser";
import { solanaWithdrawal } from "./Withdraw";
import { PublicKey } from "@solana/web3.js";

export const solana_wallet_router = createTRPCRouter({
  account: protectedProcedure.query(async ({ ctx }) => {
    const pub = await GetPublicKeyForUser({ user_id: ctx.session.user.id });
    return { publicKey: pub.publicKey };
  }),
  withdraw: protectedProcedure
    .input(z.object({ toPubkey: z.string().min(8), lamports: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const getKeypair = await GetSecretKeypairForUser({
        user_id: ctx.session.user.id,
      });

      const result = await solanaWithdrawal({
        keypair: getKeypair.keypair,
        toPubkey: new PublicKey(input.toPubkey),
        lamports: input.lamports,
      });

      return result;
    }),
});
