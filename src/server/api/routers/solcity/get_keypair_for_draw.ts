import { Keypair } from "@solana/web3.js";
import { getDB } from "~/server/db";

export async function get_keypair_for_draw(inputs: { draw_id: string }) {
  const db = await getDB();
  const draw_keys = await db.query<
    [
      {
        publicKey: string;
        secretKey: string;
        draw_id: string;
        created_at: Date;
        updated_at: Date;
      }[]
    ]
  >(`SELECT * FROM keypairs WHERE draw_id = ${inputs.draw_id};`);

  const draw_key_data = draw_keys.at(0)?.result?.at(0);

  if (!draw_key_data) throw new Error("Could not get keypair");

  const keypair = Keypair.fromSecretKey(
    Uint8Array.from(draw_key_data.secretKey.split(",").map((i) => parseInt(i)))
  );

  return keypair;
}
