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

  list: protectedProcedure.query(async () => {
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

    return parsed.map((i) => ({ ...i, ...i.draws, draws: undefined }));
  }),
  current: publicProcedure.query(async () => {
    const db = await getDB();

    const draw = await db.query(
      `SELECT * FROM draws WHERE draw_datetime > time::now() ORDER BY draw_datetime ASC LIMIT 1;`
    );

    const res = z.array(
      z.object({
        result: z.array(
          z.object({ id: z.string(), draw_datetime: z.coerce.date() })
        ),
      })
    );

    const p = res.parse(draw);
    const output = p.at(0)?.result.at(0);

    return output;
  }),
});
