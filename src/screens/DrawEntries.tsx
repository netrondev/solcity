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
import { Section } from "~/components/Section";
import { Table } from "~/components/Table";
import { type RouterOutputs, api } from "~/utils/api";
import { cn } from "~/utils/cn";
import { BiLinkExternal, BiCheck, BiCross, BiTime } from "react-icons/bi";

export function DrawEntries(props: {
  draw: RouterOutputs["solcity"]["draws"]["list"][number];
}) {
  const history = api.solana.wallet.GetTransactionHistory.useQuery({
    publicKey: props.draw.publicKey,
  });

  const session = useSession();

  return (
    <Section>
      <Heading>Entries</Heading>
      <p className="text-xs opacity-50">The entries for this draw.</p>
      <Table
        data={history.data ?? []}
        columns={[
          {
            accessorKey: "confirmationStatus",
            header: "",
            cell: (c) => {
              const confirmationStatus = c.row.original.confirmationStatus;
              if (confirmationStatus === "finalized")
                return <BiCheck className="text-emerald-500" />;
              if (confirmationStatus === "confirmed")
                return <BiTime className="text-sky-500" />;
              if (confirmationStatus === "processed")
                return <BiTime className="text-amber-500" />;
              return <BiTime className="text-neutral-500" />;
            },
          },
          // {
          //   accessorKey: "signature",
          //   cell: (p) => (
          //     <Link
          //       href={`https://solscan.io/tx/${p.row.original.signature}`}
          //     >{`${p.row.original.signature.slice(
          //       0,
          //       5
          //     )}...${p.row.original.signature.slice(-5)}`}</Link>
          //   ),
          // },
          {
            accessorKey: "date",
            cell: (p) => moment(p.row.original.date).fromNow(),
          },
          {
            accessorKey: "description",
            cell: (p) => {
              if (p.row.original.source === session.data?.user.publicKey) {
                return <>You entered</>;
              }

              return <></>;
            },
          },
          // {
          //   accessorKey: "fee",
          //   header: "Fee",
          //   cell: (p) => p.row.original.details.meta?.fee,
          // },
          {
            accessorKey: "SOL",
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
    </Section>
  );
}
