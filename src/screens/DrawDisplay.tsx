import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { Countdown } from "~/components/Countdown";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";
import { useAppState } from "~/hooks/useAppState";
import { type RouterOutputs } from "~/utils/api";
import {
  // GetBalanceConfig,
  // AccountBalancePair,
  type Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

async function PredictFee(input: {
  fromPubkey: PublicKey;
  toPubkey: PublicKey;
  lamports: number;
}) {
  const connection = new Connection("https://api.metaplex.solana.com");
  const { blockhash } = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: input.fromPubkey,
    recentBlockhash: blockhash,
  })
    .add(
      SystemProgram.transfer({
        fromPubkey: input.fromPubkey,
        toPubkey: input.toPubkey,
        lamports: input.lamports,
      })
    )
    .compileMessage();

  const response = await connection.getFeeForMessage(transaction, "confirmed");
  const feeInLamports = response.value;
  return feeInLamports;
}

export function DrawDisplay({
  draw,
}: {
  draw: RouterOutputs["solcity"]["draws"]["list"][number];
}) {
  const appState = useAppState();
  const session = useSession();

  const userSol = appState.balance_lamports
    ? appState.balance_lamports / LAMPORTS_PER_SOL
    : 0;

  const [feeprediction, setFeePrediction] = useState<number>(5000);
  const feeSol = feeprediction / LAMPORTS_PER_SOL;
  const userSolMaxMinusFee = userSol - feeSol;

  const [enter_sol, setEnterSol] = useState(
    userSolMaxMinusFee > 0 ? userSolMaxMinusFee : 0
  );

  useEffect(() => {
    if (userSolMaxMinusFee > 0 && enter_sol <= feeSol) {
      setEnterSol(userSolMaxMinusFee);
    }
    if (session.data) {
      PredictFee({
        fromPubkey: new PublicKey(session.data.user.publicKey),
        toPubkey: new PublicKey(draw.publicKey),
        lamports: enter_sol,
      })
        .then((fee) => {
          if (fee) setFeePrediction(fee);
        })
        .catch(console.error);
    }
  }, [appState.balance_lamports, enter_sol]);

  return (
    <Section className="gap-0">
      {draw.is_closed && <Heading>Past Draw</Heading>}
      {draw.is_next && <Heading>Current Draw</Heading>}

      <span className="text-3xl font-bold text-gray-900 dark:text-white">
        <SolanaPublicInfo onlyString publicKey={draw.publicKey} />
      </span>
      <Countdown target={draw.draw_datetime} />
      <span className="text-sm opacity-50">
        {moment(draw.draw_datetime).format("Do MMM YYYY [at] h:mm a")}
        &nbsp;
        {Intl.DateTimeFormat().resolvedOptions().timeZone} time
      </span>

      {draw.is_open && session.status === "authenticated" && (
        <Section>
          {session.status === "authenticated" && (
            <>
              {appState.balance_lamports != null && (
                <>
                  <Section className="shadow-none">
                    <div className="flex flex-row items-center gap-1">
                      <Input
                        type="number"
                        value={enter_sol}
                        className="w-full appearance-none"
                        max={userSolMaxMinusFee}
                        onChange={(e) => {
                          if (!appState.balance_lamports) return;

                          setEnterSol(e.target.valueAsNumber);
                        }}
                      />
                      <Button
                        // className="bg-emerald-500 bg-emerald-500/10 text-gray-900 hover:bg-emerald-500/20 hover:text-emerald-300 dark:text-emerald-500"
                        onClick={() => {
                          if (!appState.balance_lamports) return;
                          setEnterSol(userSolMaxMinusFee);
                        }}
                      >
                        MAX
                      </Button>
                      <Button className="self-center">ENTER THIS DRAW</Button>
                    </div>
                    {feeprediction && (
                      <span className="text-right text-xs">
                        tx fee -{feeprediction / LAMPORTS_PER_SOL}
                      </span>
                    )}
                  </Section>
                </>
              )}

              <span>YOUR ENTRY</span>
              <span className="text-3xl font-bold">0 SOL</span>
            </>
          )}
        </Section>
      )}
    </Section>
  );
}
