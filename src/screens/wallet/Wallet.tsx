import { Section } from "~/components/Section";
import { DepositScreen } from "./Deposit";
import { WithdrawScreen } from "./Withdraw";
import { TransactionHistory } from "./TransactionHistory";
import Head from "next/head";
import { Heading } from "~/components/Heading";
import Button from "~/components/Button";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";
import { Loading } from "~/components/Loading";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
export function Wallet(props: {
  publicKey: string;
  onlyString?: boolean;
  onGetBalance?: (balance: number) => void;
  own?: boolean;
}) {
  const session = useSession();
  const publicKey = session.data?.user.publicKey;

  const balanceRequest = api.solana.wallet.get_balance.useQuery(
    props.own
      ? undefined
      : {
          publicKey: props.publicKey,
        }
  );
  return (
    <>
      <Head>
        <title>Wallet</title>
        <meta
          name="Sol City the best way to win"
          content="Build during the 2023 Solana hyperdrive hackathon"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative isolate overflow-hidden bg-gray-900 px-6  text-center shadow-2xl sm:rounded-3xl sm:px-16">
        <div className="flex flex-row items-center justify-between pt-2">
          <Heading>Wallet</Heading>
          <Button href={`https://solscan.io/account/${publicKey}`}>
            View on Solscan
          </Button>
        </div>
        {/* <DepositScreen />
        <WithdrawScreen /> */}
        <div className="text-xl text-green-500">
          <Heading>Balance</Heading>
          {balanceRequest.isLoading && <Loading />}
          {balanceRequest.data && (
            <pre>
              {(balanceRequest.data.lamports / LAMPORTS_PER_SOL).toFixed(8)} SOL
            </pre>
          )}
        </div>
        <TransactionHistory />

        <div
          className="absolute -top-24 right-0 -z-10 transform-gpu animate-pulse blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>

        <div className="flex gap-3">
          <Button href="/deposit">Deposit</Button>
          <Button href="/withdraw">Withdraw</Button>
        </div>
      </div>
    </>
  );
}
