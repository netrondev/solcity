import { Connection, type PublicKey } from "@solana/web3.js";
import { env } from "~/env.mjs";

export async function GetBalance(input: { publicKey: PublicKey }) {
  const connection = new Connection(env.SOLANA_RPC);
  const lamports = await connection.getBalance(input.publicKey);
  return { lamports };
}
