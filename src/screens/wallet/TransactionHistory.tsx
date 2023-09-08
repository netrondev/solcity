import {
  ConfirmedSignatureInfo,
  Connection,
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { Table } from "~/components/Table";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

export function TransactionHistory() {
  //   const [toPubkey, setToPubkey] = useState<string>("");
  //   const [lamports, setLamports] = useState<number | undefined>();
  //   const wallet_withdraw_api = api.solana.wallet.withdraw.useMutation();
  //   const [tx, setTX] = useState<unknown>();
  //   const session = useSession();

  //   useEffect(() => {
  //     if (!session.data) return;
  //     const address = new PublicKey(session.data.user.publicKey);
  //     GetHistory(address)
  //       .then((data) => {
  //         setTX(data);
  //       })
  //       .catch(console.error);
  //   }, [session.data]);

  const history = api.solana.wallet.GetTransactionHistory.useQuery();
  return (
    <Section>
      <Heading>History</Heading>
      <p className="text-xs opacity-50">
        This shows the history for your wallet.
      </p>

      <Table
        data={history.data ?? []}
        columns={[
          {
            accessorKey: "signature",
            cell: (p) => (
              <Link
                href={`https://solscan.io/tx/${p.row.original.signature}`}
              >{`${p.row.original.signature.slice(
                0,
                5
              )}...${p.row.original.signature.slice(-5)}`}</Link>
            ),
          },
          {
            accessorKey: "date",
            cell: (p) => moment(p.row.original.date).fromNow(),
          },
          {
            accessorKey: "confirmationStatus",
          },
          {
            accessorKey: "fee",
            header: "Fee",
            cell: (p) => p.row.original.details.meta?.fee,
          },
          {
            accessorKey: "totalChangeAmount",
            accessorFn: (i) => {
              return i.totalChangeAmount / LAMPORTS_PER_SOL;
            },
            cell: (i) => {
              const value = i.getValue() as number;
              return (
                <div
                  className={cn(value > 0 ? "text-green-500" : "text-rose-500")}
                >
                  {value}
                </div>
              );
            },
          },
        ]}
      />

      {/* <pre>{JSON.stringify(history.data, null, 2)}</pre> */}
    </Section>
  );
}
