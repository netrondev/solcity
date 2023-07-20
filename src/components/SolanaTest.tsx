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
import { useEffect, useState } from "react";
import { Panel } from "./Panel";

import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { useAppState } from "~/hooks/useAppState";

export function SolanaTest() {
  const appstate = useAppState();
  // https://yihau.github.io/solana-web3-demo/tour/get-sol-balance.html

  const [secret, secret_set] = useState<string>("");
  const [target, target_set] = useState<string>("");
  const [balance, balance_set] = useState<number | null>(null);
  const [loaded, loaded_set] = useState<boolean>(false);

  const secretKey = Uint8Array.from([
    176, 30, 163, 155, 116, 137, 49, 76, 224, 96, 61, 75, 46, 8, 140, 143, 16,
    131, 85, 225, 192, 71, 111, 65, 183, 136, 155, 237, 149, 81, 232, 97, 12,
    180, 71, 145, 181, 12, 134, 168, 185, 141, 104, 208, 198, 146, 58, 104, 97,
    132, 116, 2, 144, 61, 112, 91, 2, 114, 216, 157, 246, 245, 227, 51,
  ]);

  const key = Keypair.fromSecretKey(secretKey);
  const [keypair, keypair_set] = useState<Keypair>(key);

  const connection = new Connection("https://api.metaplex.solana.com");

  useEffect(() => {
    if (!loaded) loaded_set(true);
  }, []);

  if (!loaded) return <div>loading...</div>;

  return (
    <>
      <button
        onClick={() => {
          const keypair = Keypair.generate();
          keypair_set(keypair);

          connection
            .getBalance(keypair.publicKey)
            .then((result) => {
              balance_set(result / LAMPORTS_PER_SOL);
            })
            .catch(console.error);
        }}
      >
        generate keypair
      </button>
      <Panel>
        <span className="text-xl text-purple-600">BALANCE: {balance} SOL</span>
        <span>{keypair?.publicKey.toString()}</span>
      </Panel>
      <Panel>
        {keypair && <QRCodeSVG value={keypair?.publicKey.toString() ?? ""} />}
      </Panel>
      <Panel>
        <span>Number: {appstate.test}</span>
        <button
          onClick={() => {
            appstate.set({ test: appstate.test + 1 });

            if (keypair) {
              appstate.set({ keypair_secret: keypair.secretKey.toString() });
            }
          }}
        >
          Increase test
        </button>
      </Panel>
      <Panel>
        <label>Secret key:</label>
        <span></span>
        <pre>{JSON.stringify(appstate, null, 2)}</pre>
        <input
          className="border p-1"
          value={secret}
          onChange={(e) => {
            secret_set(e.target.value);
          }}
        ></input>
        <button onClick={() => {}}>OK</button>
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

            const toPubkey = new PublicKey("targetaccountpubkeyhere");

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
