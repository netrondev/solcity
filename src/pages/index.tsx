import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { HomePage } from "~/screens/HomePage";

export default function Home() {
  const session = useSession();
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
      <main className="bg-gray-50">
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        <HomePage />
      </main>
    </>
  );
}
