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
import { BiLinkExternal, BiCheck, BiCross, BiTime } from "react-icons/bi";
import { Loading } from "~/components/Loading";

export function TransactionHistory({ publicKey }: { publicKey?: string }) {
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

  const session = useSession();

  const history = api.solana.wallet.GetTransactionHistory.useQuery({
    publicKey,
  });

  const draws = api.solcity.draws.list.useQuery();

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

          {
            accessorKey: "date",
            cell: (p) => moment(p.row.original.date).fromNow(),
          },

          // {
          //   accessorKey: "fee",
          //   header: "Fee",
          //   cell: (p) =>
          //     p.row.original.details.meta?.fee
          //       ? p.row.original.details.meta.fee / LAMPORTS_PER_SOL
          //       : "",
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
          // {
          //   accessorKey: "source",
          // },
          {
            accessorKey: "destination",
            header: "",
            cell: (c) => {
              const destination = c.row.original.destination;
              if (!draws.data) return <></>;

              const draw = draws.data.find((i) => i.publicKey === destination);
              if (!draw) return <></>;
              if (!draw && destination === session.data?.user.publicKey)
                return <>You</>;
              return (
                <Button href={`/draw/${draw.id.split(":")[1]!}`}>
                  Entered draw
                </Button>
              );
            },
          },
          {
            accessorKey: "signature",
            header: "",
            cell: (p) => (
              <Button
                href={`https://solscan.io/tx/${p.row.original.signature}`}
                className="aspect-square p-0.5"
              >
                <BiLinkExternal />
              </Button>
            ),
          },
        ]}
      />

      {history.isLoading && <Loading />}

      {/* <pre>{JSON.stringify(history.data, null, 2)}</pre> */}
    </Section>
  );
}
