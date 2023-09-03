import { getDB } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

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

type KeypairsDBEntry = {
  publicKey: string;
  secretKey: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export async function GetPublicKeyForUser(inputs: { user_id: string }) {
  const db = await getDB();

  const wallets_data = await db.query<[KeypairsDBEntry[]]>(
    `SELECT * FROM keypairs WHERE user_id = ${inputs.user_id};`
  );

  let keypair = Keypair.generate();

  const stored_data = wallets_data.at(0)?.result?.at(0);
  if (!stored_data) {
    // create pair
    keypair = Keypair.generate();
    const saved_keypair = await db.query(
      `CREATE keypairs CONTENT ${JSON.stringify({
        user_id: inputs.user_id,
        publicKey: keypair.publicKey.toJSON(),
        secretKey: keypair.secretKey.toString(),
        created_at: new Date(),
        updated_at: new Date(),
      })};`
    );
    console.log(saved_keypair);
  } else {
    keypair = Keypair.fromSecretKey(
      Uint8Array.from(stored_data.secretKey.split(",").map((i) => parseInt(i)))
    );
  }

  const publicKey = keypair.publicKey.toJSON();
  return { publicKey };
}

export const solana_wallet_router = createTRPCRouter({
  account: protectedProcedure.query(async ({ ctx }) => {
    const pub = await GetPublicKeyForUser({ user_id: ctx.session.user.id });
    return { publicKey: pub.publicKey };
  }),
});
