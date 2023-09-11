import { Section } from "~/components/Section";
import { DepositScreen } from "./Deposit";
import { WithdrawScreen } from "./Withdraw";
import { TransactionHistory } from "./TransactionHistory";
import Head from "next/head";
import { Heading } from "~/components/Heading";
import Button from "~/components/Button";
import { useSession } from "next-auth/react";

export function Wallet() {
  const session = useSession();
  const publicKey = session.data?.user.publicKey;
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
      <Section>
        <div className="flex flex-row items-center justify-between">
          <Heading>Wallet</Heading>
          <Button href={`https://solscan.io/account/${publicKey}`}>
            View on Solscan
          </Button>
        </div>
        <DepositScreen />
        <WithdrawScreen />
        <TransactionHistory />
      </Section>
    </>
  );
}
