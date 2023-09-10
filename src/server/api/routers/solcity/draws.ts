import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { getDB } from "~/server/db";
import { Keypair, PublicKey } from "@solana/web3.js";
import { TRPCError } from "@trpc/server";
import { GetSecretKeypairForUser } from "../solana/GetPublicKeyForUser";
import { SendAndConfirm } from "../solana/Withdraw";
import { get_draws as get_draws_list } from "./draws_functions";
import { GetTransactionHistory } from "../solana/GetTXHistory";
import { GetBalance } from "../solana/wallet_function";

export const drawsRouter = createTRPCRouter({
  /** DEV ENDPOINT TO CLEAR OLD DRAWS */
  clear_draws: adminProcedure.mutation(async () => {
    const db = await getDB();
    const result = await db.query("DELETE draws;");
    return result;
  }),
  create_draw: adminProcedure
    .input(z.object({ draw_datetime: z.date() }))
    .mutation(async ({ input }) => {
      const db = await getDB();
      const keypair = Keypair.generate();
      const created = await db.create("draws", input);
      const draw_id = created.at(0)?.id;

      if (!draw_id)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "could not create draw with id.",
        });

      const saved_keypair = await db.query(
        `CREATE keypairs CONTENT ${JSON.stringify({
          draw_id,
          publicKey: keypair.publicKey.toJSON(),
          secretKey: keypair.secretKey.toString(),
          created_at: new Date(),
          updated_at: new Date(),
        })};`
      );

      if (!saved_keypair)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not save draw keypair.",
        });

      return created;
    }),

  list: publicProcedure.query(async () => {
    const data = await get_draws_list();
    return data;
  }),
  enter_draw: protectedProcedure
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
  run_draw: adminProcedure
    .input(
      z.object({
        draw_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const draws = await get_draws_list();
      const draw = draws.find((i) => i.id.endsWith(input.draw_id));
      if (!draw) throw new TRPCError({ code: "NOT_FOUND" });
      const publicKey = new PublicKey(draw.publicKey);
      const transactions = await GetTransactionHistory(publicKey);

      const balance = await GetBalance({
        publicKey,
      });

      return { draw, balance, transactions };
    }),
});
