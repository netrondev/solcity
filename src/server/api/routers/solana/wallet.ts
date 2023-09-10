import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import {
  GetPublicKeyForUser,
  GetSecretKeypairForUser,
} from "./GetPublicKeyForUser";
import { SendAndConfirm } from "./Withdraw";
import { PublicKey } from "@solana/web3.js";
import { GetTransactionHistory } from "./GetTXHistory";
import { GetBalance } from "./wallet_function";
import { TRPCError } from "@trpc/server";

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
  get_balance: publicProcedure
    .input(z.object({ publicKey: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const pubkeystring = input?.publicKey ?? ctx.session?.user.publicKey;

      if (!pubkeystring) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "missing publicKey from request.",
        });
      }

      const publicKey = new PublicKey(pubkeystring);
      const data = await GetBalance({ publicKey });
      return data;
    }),
});
