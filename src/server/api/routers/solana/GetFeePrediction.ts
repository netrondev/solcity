import {
  Connection,
  Transaction,
  SystemProgram,
  type PublicKey,
  type TransactionBlockhashCtor,
} from "@solana/web3.js";
import { env } from "~/env.mjs";

export async function GetFeePrediction(input: {
  fromPubkey: PublicKey;
  toPubkey: PublicKey;
  lamports: number;
}) {
  const connection = new Connection(env.SOLANA_RPC);
  const { blockhash } = await connection.getLatestBlockhash();
  const lastValidBlockHeight = await connection.getBlockHeight();

  const options: TransactionBlockhashCtor = {
    blockhash,
    feePayer: input.fromPubkey,
    lastValidBlockHeight,
  };

  const transaction = new Transaction(options)
    .add(
      SystemProgram.transfer({
        fromPubkey: input.fromPubkey,
        toPubkey: input.toPubkey,
        lamports: input.lamports,
      })
    )
    .compileMessage();

  const response = await connection.getFeeForMessage(transaction, "confirmed");
  const feeInLamports = response.value;
  return feeInLamports ?? 5000;
}
