import { Section } from "~/components/Section";
import { DepositScreen } from "./Deposit";
import { WithdrawScreen } from "./Withdraw";
import { TransactionHistory } from "./TransactionHistory";
import Head from "next/head";

export function Wallet() {
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
        <DepositScreen />
        <WithdrawScreen />
        <TransactionHistory />
      </Section>
    </>
  );
}
