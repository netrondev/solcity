import {
  // GetBalanceConfig,
  // AccountBalancePair,
  type Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  Transaction,
  SystemProgram,
  type PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { env } from "~/env.mjs";

export async function SendAndConfirm(props: {
  keypair: Keypair;
  toPubkey: PublicKey;
  lamports: number;
}) {
  const connection = new Connection(env.SOLANA_RPC);
  const transaction = new Transaction();

  const newtransaction = transaction.add(
    SystemProgram.transfer({
      fromPubkey: props.keypair.publicKey,
      toPubkey: props.toPubkey,
      lamports: props.lamports,
    })
  );

  const result = await sendAndConfirmTransaction(connection, newtransaction, [
    props.keypair,
  ]);
  return result;
}
