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

export async function solanaWithdrawal(props: {
  keypair: Keypair;
  toPubkey: PublicKey;
  lamports: number;
}) {
  // console.log(props);
  // return;

  const connection = new Connection("https://api.metaplex.solana.com");
  const transaction = new Transaction();

  //   const toPubkey = new PublicKey("targetaccountpubkeyhere");

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
