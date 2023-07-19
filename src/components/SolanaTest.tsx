import {
  GetBalanceConfig,
  AccountBalancePair,
  Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useState } from "react";
import { Panel } from "./Panel";

export function SolanaTest() {
  // https://yihau.github.io/solana-web3-demo/tour/get-sol-balance.html

  const [secret, secret_set] = useState<string>("");
  const [target, target_set] = useState<string>("");
  const [balance, balance_set] = useState(0);

  const secretKey = Uint8Array.from([
    
  ]);

  const keypair = Keypair.fromSecretKey(secretKey);

  const connection = new Connection("https://api.metaplex.solana.com");

  connection
    .getBalance(keypair.publicKey)
    .then((result) => {
      balance_set(result / LAMPORTS_PER_SOL);
    })
    .catch(console.error);

  return (
    <>
      <Panel>
        <span className="text-xl text-purple-600">BALANCE: {balance} SOL</span>
        <span>{keypair.publicKey.toString()}</span>
      </Panel>
      <Panel>
        <label>Secret key:</label>
        <input
          className="border p-1"
          value={secret}
          onChange={(e) => {
            secret_set(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            
          }}
        >
          OK
        </button>
      </Panel>

      <Panel>
        <label>Target address: {target}</label>
        <input
          className="border p-1"
          value={target}
          onChange={(e) => {
            target_set(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            
            const transaction = new Transaction();

            const toPubkey = new PublicKey(
              "targetaccountpubkeyhere"
            );

            const newtransaction = transaction.add(
              SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey,
                lamports: 0.117 * LAMPORTS_PER_SOL,
              })
            );

            

            sendAndConfirmTransaction(connection, newtransaction, [keypair])
              .then((result) => {
                console.log(result);
              })
              .catch(console.error);
          }}
        >
          OK
        </button>
      </Panel>
    </>
  );
}
