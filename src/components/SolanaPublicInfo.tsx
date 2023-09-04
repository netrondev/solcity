import { QRCodeSVG } from "qrcode.react";
import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { Section } from "./Section";
import { useEffect, useState } from "react";
import Button from "./Button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function SolanaPublicInfo(props: {
  publicKey: string;
  onlyString?: boolean;
}) {
  const [balance, setBalance] = useState<number | null>(null);

  async function GetBalance(publicKey: string) {
    setBalance(null);
    const pub = new PublicKey(publicKey);
    const connection = new Connection("https://api.metaplex.solana.com");

    const value = await connection.getBalance(pub);
    setBalance(value);
  }

  useEffect(() => {
    void GetBalance(props.publicKey);
  }, [props.publicKey]);

  if (props.onlyString) {
    return (
      <div className="flex h-6 items-center">
        {balance === null ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <pre>{(balance / LAMPORTS_PER_SOL).toFixed(8)} SOL</pre>
        )}
      </div>
    );
  }

  return (
    <Section className="flex flex-row">
      <div className="self-start rounded bg-white p-2">
        <QRCodeSVG value={props.publicKey} />
      </div>

      <div>
        <span>Public Key:</span>
        <pre>{props.publicKey}</pre>
        <span>Balance:</span>
        <div className="h-6">
          {balance === null ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <pre>{(balance / LAMPORTS_PER_SOL).toFixed(8)} SOL</pre>
          )}
        </div>
        <Button
          onClick={() => {
            void GetBalance(props.publicKey);
          }}
        >
          refresh
        </Button>
      </div>
    </Section>
  );
}
