import Head from "next/head";

import { HomePage } from "~/screens/HomePage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sol City Lottery</title>
        <meta
          name="Sol City the best way to win"
          content="Build during the 2023 Solana hyperdrive hackathon"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HomePage />
      </main>
    </>
  );
}
