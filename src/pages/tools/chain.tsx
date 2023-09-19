import {
  Connection,
  PublicKey,
  type ParsedInstruction,
  Logs,
} from "@solana/web3.js";
import { useState } from "react";
import { z } from "zod";
import Button from "~/components/Button";

const WSS_ENDPOINT =
  "wss://ultra-old-night.solana-mainnet.discover.quiknode.pro/a26d599c6398bc9616dca4e316cddb38d7fe4d32/"; // replace with your URL
const HTTP_ENDPOINT =
  "https://ultra-old-night.solana-mainnet.discover.quiknode.pro/a26d599c6398bc9616dca4e316cddb38d7fe4d32/"; // replace with your URL

const solanaConnection = new Connection(HTTP_ENDPOINT, {
  wsEndpoint: WSS_ENDPOINT,
});

const sollogz = z
  .object({
    signature: z.string(),
    err: z
      .object({
        InstructionError: z
          .tuple([
            z.number(),
            z.union([z.object({ Custom: z.number() }), z.string()]),
          ])
          .optional(),
        InsufficientFundsForRent: z
          .object({
            account_index: z.number(),
          })
          .optional(),
      })
      .strict()
      .nullable(),
    logs: z.array(z.string()),
  })
  .strict();

function parseLog(i: Logs) {
  const a = sollogz.safeParse(i);

  if (a.success === false) {
    console.log("------------------");
    console.log(JSON.stringify(i, null, 2));
    console.log(a.error);
  }

  return sollogz.parse(i);
}

export default function ChainView() {
  const [latest, setLatest] = useState<z.infer<typeof sollogz>>();
  const [subId, setSubId] = useState<number>(-1);
  const [slot, setSlot] = useState<number>(-1);

  return (
    <div>
      CHainview
      <Button
        onClick={() => {
          //   const WSS_ENDPOINT =
          //     "wss://ultra-old-night.solana-mainnet.discover.quiknode.pro/a26d599c6398bc9616dca4e316cddb38d7fe4d32/"; // replace with your URL
          //   const HTTP_ENDPOINT =
          //     "https://ultra-old-night.solana-mainnet.discover.quiknode.pro/a26d599c6398bc9616dca4e316cddb38d7fe4d32/"; // replace with your URL

          const sid = solanaConnection.onLogs("all", (ev, ctx) => {
            // const a = latest;
            // const b = parseLog(ev);

            // a.push(b);
            console.log(ev);
            // setLatest(b);
            // setSlot(ctx.slot);
          });
          setSubId(sid);
        }}
      >
        Test
      </Button>
      <Button
        onClick={() => {
          solanaConnection.removeOnLogsListener(subId).catch(console.error);
        }}
      >
        STOP
      </Button>
      <pre>{JSON.stringify({ subId, slot }, null, 2)}</pre>
      <pre>{JSON.stringify(latest, null, 2)}</pre>
    </div>
  );
}
