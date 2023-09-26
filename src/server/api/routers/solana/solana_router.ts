import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { solana_wallet_router } from "./wallet";
import { GetFeePrediction } from "./GetFeePrediction";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { env } from "~/env.mjs";
import { token_router } from "./token_router";

export const solana_router = createTRPCRouter({
  rpc: protectedProcedure.query(() => {
    return { rpc: env.SOLANA_RPC };
  }),
  wallet: solana_wallet_router,
  getFeePrediction: publicProcedure
    .input(
      z.object({
        toPubkey: z.string(),
        lamports: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return { fee: 0.000005 * LAMPORTS_PER_SOL };
      // const fromPubkeystring =
      //   ctx.session?.user.publicKey ?? env.SOLCITY_HOUSE_PUBKEY;

      // const fee = await GetFeePrediction({
      //   fromPubkey: new PublicKey(fromPubkeystring),
      //   toPubkey: new PublicKey(input.toPubkey),
      //   lamports: input.lamports,
      // });
      // return { fee };
    }),
  token: token_router,
});
