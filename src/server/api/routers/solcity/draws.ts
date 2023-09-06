import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { getDB } from "~/server/db";

import {
  // GetBalanceConfig,
  // AccountBalancePair,
  Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { TRPCError } from "@trpc/server";

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
    const db = await getDB();

    const draws = await db.query<
      [{ publicKey: string; draws: { draw_datetime: Date; id: string } }[]]
    >(
      `SELECT publicKey, draw_id as draws FROM keypairs WHERE draw_id FETCH draws;`
    );

    const output = draws.at(0)?.result;

    if (!output) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const parsed = z
      .array(
        z
          .object({
            publicKey: z.string(),
            draws: z.object({ draw_datetime: z.coerce.date(), id: z.string() }),
          })
          .strict()
      )
      .parse(output);

    console.log(parsed);

    let first_open_found = false;

    const draw_calc = parsed
      .map((i) => ({
        ...i,
        ...i.draws,
        draws: undefined,
      }))
      .map((i) => ({
        ...i,
        is_closed: i.draw_datetime.getTime() < new Date().getTime(),
        is_open: i.draw_datetime.getTime() > new Date().getTime(),
      }))
      .sort((a, b) => (a.draw_datetime > b.draw_datetime ? 1 : -1))
      .map((i) => {
        let is_next = false;

        if (i.is_open && !first_open_found) {
          is_next = true;
          first_open_found = true;
        }

        return {
          ...i,
          is_next,
        };
      })
      .map((i, idx, arr) => {
        let is_last = false;
        const next = arr[idx + 1];
        if (i.is_closed) {
          if ((next && next.is_open) ?? !next) {
            is_last = true;
          }
        }

        return { ...i, is_last };
      });

    return draw_calc;
  }),
});
