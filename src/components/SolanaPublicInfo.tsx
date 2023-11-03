import { QRCodeSVG } from "qrcode.react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Section } from "./Section";
import Button from "./Button";
import { Loading } from "./Loading";
import { api } from "~/utils/api";

export function SolanaPublicInfo(props: {
  publicKey: string;
  onlyString?: boolean;
  onGetBalance?: (balance: number) => void;
  own?: boolean;
}) {
  const balanceRequest = api.solana.wallet.get_balance.useQuery(
    props.own
      ? undefined
      : {
          publicKey: props.publicKey,
        }
  );

  if (props.onlyString) {
    if (balanceRequest.isLoading) return <Loading />;

    if (balanceRequest.data) {
      return (
        <>{(balanceRequest.data.lamports / LAMPORTS_PER_SOL).toFixed(8)} SOL</>
      );
    }

    return <>Error</>;
  }

  return (
    <Section className="">
      <div className="mx-auto self-start rounded bg-white p-2">
        <QRCodeSVG value={props.publicKey} />
      </div>

      <div className="mx-auto mt-2 rounded-xl bg-gray-800 md:p-2 ">
        <span>Public Key:</span>
        <pre className="text-xs md:text-base">{props.publicKey}</pre>
        <span>Balance:</span>
        <div className="h-6">
          {balanceRequest.isLoading && <Loading />}
          {balanceRequest.data && (
            <pre>
              {(balanceRequest.data.lamports / LAMPORTS_PER_SOL).toFixed(8)} SOL
            </pre>
          )}
        </div>
        <Button
          onClick={() => {
            balanceRequest.refetch().catch(console.error);
          }}
        >
          refresh
        </Button>
      </div>
    </Section>
  );
}
