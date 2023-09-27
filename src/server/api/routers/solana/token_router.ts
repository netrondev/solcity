import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { getDB } from "~/server/db";
import { TRPCError } from "@trpc/server";

import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createMint,
  getMint,
  mintToChecked,
} from "@solana/spl-token";
import { env } from "~/env.mjs";
import { Connection } from "@solana/web3.js";
import { GetSecretKeypairForUser } from "./GetPublicKeyForUser";

export const token_router = createTRPCRouter({
  listTokens: protectedProcedure.query(async () => {
    const db = await getDB();

    const data = await db.query("SELECT * FROM tokens;");

    return data;
  }),
  create: protectedProcedure
    .input(
      z.object({
        tokenName: z.string(),
        tokenSupply: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // check the db if the token name exists

      if (input.tokenName === "")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token name cant be empty!",
        });

      const connection = new Connection(env.SOLANA_RPC, "confirmed");

      const user_wallet = await GetSecretKeypairForUser({
        user_id: ctx.session.user.id,
      });

      const decimals = 8;

      const mintPubkey = await createMint(
        connection, // conneciton
        user_wallet.keypair, // fee payer
        user_wallet.keypair.publicKey, // mint authority
        user_wallet.keypair.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
        decimals // decimals
      );

      const db = await getDB();

      const result = await db.create("mint", {
        user_id: ctx.session.user.id,
        tokenName: input.tokenName,
        tokenSupply: input.tokenSupply,
        mintPubkey,
        created_at: new Date(),
        updated_at: new Date(),
        mintAuthority: user_wallet.keypair.publicKey,
        freezeAuthority: user_wallet.keypair.publicKey,
        decimals,
      });

      // do the mint and add to the db.

      return { result };
    }),
  list_mints_for_user: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDB();
    const data = await db.query(
      `SELECT * FROM mint WHERE user_id = ${ctx.session.user.id};`
    );

    return data;
  }),
});
