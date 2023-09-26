import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";

import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createMint,
  getMint,
  mintToChecked,
} from "@solana/spl-token";
import {
  AccountInfo,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import Button from "~/components/Button";
import { api } from "~/utils/api";
import { Loading } from "~/components/Loading";
import * as bs58 from "bs58";
import Link from "next/link";
import { useState } from "react";

async function MintToken(inputs: { connection: Connection; keypair: Keypair }) {
  const mintPubkey = await createMint(
    inputs.connection, // conneciton
    inputs.keypair, // fee payer
    inputs.keypair.publicKey, // mint authority
    inputs.keypair.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    8 // decimals
  );

  console.log(`mint: ${mintPubkey.toBase58()}`);
  // 42DmCiNmCvpjC5Q21NPXxAoMx6EXA11HA3tNS8NBtM7H
}

export default function MintPage() {
  const [tokenAccounts, setTokenAccounts] = useState<
    {
      pubkey: PublicKey;
      account: AccountInfo<ParsedAccountData>;
    }[]
  >();

  const { data: connection } = api.solana.rpc.useQuery(undefined, {
    select: (data) => {
      return new Connection(data.rpc, "confirmed");
    },
  });

  const { data: keypair } = api.solana.wallet.getkeypair.useQuery(undefined, {
    select: (data) => {
      const keypa = Keypair.fromSecretKey(bs58.decode(data.secretKey));
      return keypa;
    },
  });

  if (!keypair) return <Loading />;
  if (!connection) return <Loading />;

  return (
    <Section>
      <Heading>MINT</Heading>

      <Button
        onClick={async () => {
          const res = await connection.getParsedTokenAccountsByOwner(
            keypair.publicKey,
            {
              mint: new PublicKey(
                "42DmCiNmCvpjC5Q21NPXxAoMx6EXA11HA3tNS8NBtM7H"
              ),
            }
          );
          console.log(res);

          setTokenAccounts(res.value);

          res.value.forEach((accountInfo) => {
            console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
            console.log(`mint: ${accountInfo.account.data.parsed.info.mint}`);
            console.log(`owner: ${accountInfo.account.data.parsed.info.owner}`);
            console.log(
              `decimals: ${accountInfo.account.data.parsed.info.tokenAmount.decimals}`
            );
            console.log(
              `amount: ${accountInfo.account.data.parsed.info.tokenAmount.amount}`
            );
            console.log("====================");
          });
        }}
      >
        LIST
      </Button>

      {tokenAccounts?.map((ta) => (
        <Section key={ta.pubkey.toBase58()} className="flex flex-col">
          <span>Pubkey: {ta.pubkey.toBase58()}</span>
          <span>Mint: {ta.account.data.parsed.info.mint}</span>
          <span>
            Owner: {ta.account.data.parsed.info.owner}{" "}
            {keypair.publicKey.toBase58() === ta.account.data.parsed.info.owner
              ? "(you)"
              : "(not owner)"}
          </span>
          <span>
            Decimals: {ta.account.data.parsed.info.tokenAmount.decimals}
          </span>
          <span>Amount: {ta.account.data.parsed.info.tokenAmount.amount}</span>
        </Section>
      ))}

      <Button
        onClick={async () => {
          const mintAccount = await getMint(
            connection,
            new PublicKey("42DmCiNmCvpjC5Q21NPXxAoMx6EXA11HA3tNS8NBtM7H")
          );

          console.log({
            address: mintAccount.address.toBase58(),
            mintAuthority: mintAccount.mintAuthority?.toBase58(),
            supply: mintAccount.supply,
            decimals: mintAccount.decimals,
            isInitialized: mintAccount.isInitialized,
            freezeAuthority: mintAccount.freezeAuthority?.toBase58(),
            tlv: mintAccount.tlvData.toString(),
          });
        }}
      >
        MINT INFO
      </Button>

      <Button
        onClick={async () => {
          const txhash = await mintToChecked(
            connection, // connection
            keypair, // fee payer
            new PublicKey("42DmCiNmCvpjC5Q21NPXxAoMx6EXA11HA3tNS8NBtM7H"), // mint
            new PublicKey("43wfqixenJVk2tZkxAt8cMSrRMfJPHn96X5ebvikCiUv"), // receiver (sholud be a token account)
            keypair.publicKey, // mint authority
            10000, // amount. if your decimals is 8, you mint 10^8 for 1 token.
            8 // decimals
          );
          console.log(txhash);
        }}
      >
        MINT SUPPLY
      </Button>

      <Button
        onClick={async () => {
          const ata = await createAssociatedTokenAccount(
            connection, // connection
            keypair, // fee payer
            new PublicKey("42DmCiNmCvpjC5Q21NPXxAoMx6EXA11HA3tNS8NBtM7H"), // mint
            keypair.publicKey // owner,
          );
          console.log(ata);
        }}
      >
        Create ATA Mint Account
      </Button>

      <Button
        onClick={async () => {
          await MintToken({
            connection,
            keypair: keypair,
          });
        }}
      >
        MINT
      </Button>

      <Link href="https://solanacookbook.com/references/token.html#what-do-i-need-to-get-started-with-spl-tokens">
        DOCS
      </Link>
    </Section>
  );
}
