import {
  LAMPORTS_PER_SOL,
  Connection,
  PublicKey,
  ParsedInstruction,
  PartiallyDecodedInstruction,
} from "@solana/web3.js";
import { env } from "~/env.mjs";
export async function GetTransactionHistory(address: PublicKey) {
  const connection = new Connection(env.SOLANA_RPC);

  const transactionList = await connection.getSignaturesForAddress(
    new PublicKey(address),
    {
      limit: 1000,
    }
  );

  const signatureList = transactionList.map(
    (transaction) => transaction.signature
  );
  const transactionDetails = await connection.getParsedTransactions(
    signatureList
  );

  const combined = transactionList.map((i, idx) => {
    let totalChangeAmount = 0;
    const details = transactionDetails[idx]!;

    const instr = details.transaction.message
      .instructions as ParsedInstruction[];
    const txs = instr.filter((i) => Boolean(i.parsed));

    for (const ins of txs) {
      // Check if this instruction is a token transfer (you can modify this based on your use case)

      if (ins.parsed.info.destination === address.toString()) {
        totalChangeAmount += ins.parsed.info.lamports;
      } else {
        totalChangeAmount -= ins.parsed.info.lamports;
      }
    }

    return {
      ...i,
      date: i.blockTime ? new Date(i.blockTime * 1000) : new Date(0),
      details,
      totalChangeAmount,
    };
  });

  return combined;
}
