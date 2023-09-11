import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { getDB } from "~/server/db";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionBlockhashCtor,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { TRPCError } from "@trpc/server";
import { GetSecretKeypairForUser } from "../solana/GetPublicKeyForUser";
import { SendAndConfirm } from "../solana/Withdraw";
import { get_draws as get_draws_list } from "./draws_functions";
import { GetTransactionHistory } from "../solana/GetTXHistory";
import { GetBalance } from "../solana/wallet_function";
import { split_number_percentage } from "~/utils/split_number_percentage";
import {
  calculate_pot_splits,
  calculate_winners,
  solcity,
} from "./solcity_core";
import { env } from "~/env.mjs";
import { get_keypair_for_draw } from "./get_keypair_for_draw";

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
      const draw_idx = draws.findIndex((i) => i.id.endsWith(input.draw_id));
      if (!draw) throw new TRPCError({ code: "NOT_FOUND" });
      if (draw_idx === undefined) throw new TRPCError({ code: "NOT_FOUND" });

      // find next draw
      const draw_next = draws.at(draw_idx + 1);

      if (!draw_next)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "before a draw can occur a next draw must exist.",
        });

      const publicKey = new PublicKey(draw.publicKey);
      const transactions = await GetTransactionHistory(publicKey);

      const balance = await GetBalance({
        publicKey,
      });

      const pot = calculate_pot_splits({ lamports: balance.lamports });

      const { winner_payouts } = calculate_winners({
        pot_actual: pot.pot_actual,
        entries: transactions.map((i) => ({
          lamports_bet: i.totalChangeAmount,
          publicKey: new PublicKey(i.source),
        })),
      });

      // construct transactions:
      // house, next_pot, winner_payouts

      const connection = new Connection(env.SOLANA_RPC);

      const { blockhash } = await connection.getLatestBlockhash();
      const lastValidBlockHeight = await connection.getBlockHeight();

      const fromPubkey = new PublicKey(draw.publicKey);

      const options: TransactionBlockhashCtor = {
        blockhash,
        feePayer: fromPubkey,
        lastValidBlockHeight,
      };

      const transaction = new Transaction(options);

      transaction.add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: new PublicKey(env.SOLCITY_HOUSE_PUBKEY),
          lamports: pot.pot_house_cut,
        })
      );

      // TODO add winner txs
      winner_payouts.forEach((w) => {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey: w.publicKey,
            lamports: w.lamports_win_per_pubkey,
          })
        );
      });

      // return result;

      const fee = await connection.getFeeForMessage(
        transaction.compileMessage(),
        "confirmed"
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: new PublicKey(draw_next.publicKey),
          lamports: pot.pot_rollover - (fee?.value ?? 5000),
        })
      );

      const keypair = await get_keypair_for_draw({ draw_id: draw.id });

      // TODO sign and send tx
      const result = await sendAndConfirmTransaction(connection, transaction, [
        keypair,
      ]);

      return {
        result,
        draw,
        draw_next,
        pot,
        balance,
        fee,
        transaction,
        // confirm_splits,
        winner_payouts,
        transactions,
      };
    }),
});
