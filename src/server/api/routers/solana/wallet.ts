import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetPublicKeyForUser,
  GetSecretKeypairForUser,
} from "./GetPublicKeyForUser";
import { SendAndConfirm } from "./Withdraw";
import { PublicKey } from "@solana/web3.js";
import { GetTransactionHistory } from "./GetTXHistory";

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

      const result = await SendAndConfirm({
        keypair: getKeypair.keypair,
        toPubkey: new PublicKey(input.toPubkey),
        lamports: input.lamports,
      });

      return result;
    }),
  GetTransactionHistory: protectedProcedure
    .input(z.object({ publicKey: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const pubkey = new PublicKey(
        input?.publicKey ?? ctx.session.user.publicKey
      );

      const data = await GetTransactionHistory(pubkey);
      return data;
    }),
});
