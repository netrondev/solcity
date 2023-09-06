import { getDB } from "~/server/db";
import { Keypair } from "@solana/web3.js";
import { TRPCError } from "@trpc/server";

type KeypairsDBEntry = {
  publicKey: string;
  secretKey: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

/** Gets the user wallet public key. SAVE TO USE */
export async function GetPublicKeyForUser(inputs: {
  user_id: string;
}): Promise<{ publicKey: string }> {
  const getKeyPair = await GetSecretKeypairForUser({ user_id: inputs.user_id });
  // only return publicKey!
  return { publicKey: getKeyPair.keypair.publicKey.toJSON() };
}

/** WARNING this could leak private keys. USE WITH CAUTION! */
export async function GetSecretKeypairForUser(inputs: { user_id: string }) {
  const db = await getDB();

  const wallets_data = await db.query<[KeypairsDBEntry[]]>(
    `SELECT * FROM keypairs WHERE user_id = ${inputs.user_id};`
  );

  if (!wallets_data)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not obtain keypair.",
    });

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

    if (!saved_keypair)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not save keypair",
      });
  } else {
    keypair = Keypair.fromSecretKey(
      Uint8Array.from(stored_data.secretKey.split(",").map((i) => parseInt(i)))
    );
  }

  // const publicKey = keypair.publicKey.toJSON();
  return { keypair };
}
