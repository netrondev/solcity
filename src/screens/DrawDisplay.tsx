import moment from "moment";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "~/components/Button";
import { Countdown } from "~/components/Countdown";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";
import { useAppState } from "~/hooks/useAppState";
import { api, type RouterOutputs } from "~/utils/api";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function DrawDisplay({
  draw,
  showLink,
  showEntries,
}: {
  draw: RouterOutputs["solcity"]["draws"]["list"][number];
  showLink?: boolean;
  showEntries?: boolean;
}) {
  const appState = useAppState();
  const session = useSession();
  const [enter_lamports, setEnterSol] = useState(0);

  const api_enter_draw = api.solcity.draws.enter_draw.useMutation();

  const feeprediction_query = api.solana.getFeePrediction.useQuery({
    toPubkey: draw.publicKey,
    lamports: enter_lamports ?? 0,
  });

  const userLamports = appState.balance_lamports
    ? appState.balance_lamports
    : 0;

  const feeprediction = feeprediction_query.data?.fee ?? 5000;
  const userLamportsMaxMinusFee = userLamports - feeprediction;

  return (
    <Section className="gap-0">
      <div className="flex flex-row">
        <div className="flex flex-1 flex-col">
          {draw.is_closed && <Heading>Past Draw</Heading>}
          {draw.is_next && <Heading>Current Draw</Heading>}

          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            <SolanaPublicInfo onlyString publicKey={draw.publicKey} />
          </span>
          {draw.is_next && <Countdown target={draw.draw_datetime} />}
          <span className="text-sm opacity-50">
            {moment(draw.draw_datetime).format("Do MMM YYYY [at] h:mm a")}
            &nbsp;
            {Intl.DateTimeFormat().resolvedOptions().timeZone} time
          </span>
        </div>
        {showLink && (
          <Button href={`/draw/${draw.id.split(":")[1]!}`}>View</Button>
        )}
      </div>

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
                        value={enter_lamports / LAMPORTS_PER_SOL}
                        className="w-full appearance-none"
                        max={userLamportsMaxMinusFee}
                        onChange={(e) => {
                          if (!appState.balance_lamports) return;

                          setEnterSol(
                            e.target.valueAsNumber * LAMPORTS_PER_SOL
                          );
                        }}
                      />
                      <Button
                        // className="bg-emerald-500 bg-emerald-500/10 text-gray-900 hover:bg-emerald-500/20 hover:text-emerald-300 dark:text-emerald-500"
                        onClick={() => {
                          if (!appState.balance_lamports) return;
                          setEnterSol(userLamportsMaxMinusFee);
                        }}
                      >
                        MAX
                      </Button>
                      <Button
                        className="self-center"
                        onClick={() => {
                          api_enter_draw.mutate({
                            lamports: enter_lamports,
                            toPubkey: draw.publicKey,
                          });
                        }}
                      >
                        ENTER THIS DRAW
                      </Button>
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
