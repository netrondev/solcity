import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { solana_wallet_router } from "./wallet";
import { GetFeePrediction } from "./GetFeePrediction";
import { PublicKey } from "@solana/web3.js";

export const solana_router = createTRPCRouter({
  wallet: solana_wallet_router,
  getFeePrediction: protectedProcedure
    .input(
      z.object({
        toPubkey: z.string(),
        lamports: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const fee = await GetFeePrediction({
        fromPubkey: new PublicKey(ctx.session.user.publicKey),
        toPubkey: new PublicKey(input.toPubkey),
        lamports: input.lamports,
      });
      return { fee };
    }),
});
