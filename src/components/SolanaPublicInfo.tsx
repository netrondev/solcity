import { QRCodeSVG } from "qrcode.react";
import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { Section } from "./Section";
import { useEffect, useState } from "react";
import Button from "./Button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function SolanaPublicInfo(props: {
  publicKey: string;
  onlyString?: boolean;
  onGetBalance?: (balance: number) => void;
}) {
  const [balance, setBalance] = useState<number | null>(null);

  // todo make trpc endpoint instead
  async function GetBalance(publicKey: string) {
    setBalance(null);
    const pub = new PublicKey(publicKey);
    const connection = new Connection(
      "https://ultra-old-night.solana-mainnet.discover.quiknode.pro/a26d599c6398bc9616dca4e316cddb38d7fe4d32/"
    );

    const value = await connection.getBalance(pub);
    if (props.onGetBalance) props.onGetBalance(value);
    setBalance(value);
  }

  useEffect(() => {
    void GetBalance(props.publicKey);
  }, [props.publicKey]);

  if (props.onlyString) {
    return (
      <>
        {balance === null ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <>{(balance / LAMPORTS_PER_SOL).toFixed(8)} SOL</>
        )}
      </>
    );
  }

  return (
    <Section className="flex flex-row gap-4">
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
