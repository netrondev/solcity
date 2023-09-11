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
import { Loading } from "~/components/Loading";

export function DrawDisplay({
  draw,
  showLink,
  showEntries,
}: {
  draw: RouterOutputs["solcity"]["draws"]["list"][number];
  showLink?: boolean;
  showEntries?: boolean;
}) {
  const session = useSession();

  const balance = api.solana.wallet.get_balance.useQuery();

  const [enter_lamports, setEnterSol] = useState(0);

  const api_enter_draw = api.solcity.draws.enter_draw.useMutation();

  const fee = api.solana.getFeePrediction.useQuery({
    toPubkey: draw.publicKey,
    lamports: 1000000, // static because else its many queries..
  });

  // const userLamports = appState.balance_lamports
  //   ? appState.balance_lamports
  //   : 0;

  // const feeprediction = feeprediction_query.data?.fee ?? 5000;
  // const userLamportsMaxMinusFee = userLamports - feeprediction;

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
              {balance.data?.lamports != null && (
                <>
                  <Section className="shadow-none">
                    <div className="flex flex-row items-center gap-1">
                      <Input
                        type="number"
                        value={enter_lamports / LAMPORTS_PER_SOL}
                        className="w-full appearance-none"
                        max={balance.data?.lamports}
                        onChange={(e) => {
                          console.log(e.target.valueAsNumber);

                          if (!balance.data?.lamports) return;
                          if (!fee.data) return;

                          let lamports =
                            e.target.valueAsNumber * LAMPORTS_PER_SOL;

                          const max = balance.data.lamports - fee.data.fee;

                          if (lamports > max) lamports = max;
                          if (lamports < fee.data.fee * 2)
                            lamports = fee.data.fee * 2;
                          // console.log(lamports);
                          // if (!appState.balance_lamports) return;
                          setEnterSol(lamports);
                        }}
                      />
                      <Button
                        // className="bg-emerald-500 bg-emerald-500/10 text-gray-900 hover:bg-emerald-500/20 hover:text-emerald-300 dark:text-emerald-500"
                        onClick={() => {
                          if (!balance.data?.lamports) return;
                          if (!fee.data) return;

                          setEnterSol(balance.data?.lamports - fee.data.fee);
                        }}
                      >
                        MAX
                      </Button>
                      <Button
                        disabled={api_enter_draw.isLoading}
                        onClick={() => {
                          api_enter_draw.mutate(
                            {
                              lamports: enter_lamports,
                              toPubkey: draw.publicKey,
                            },
                            {
                              onSuccess: () => {
                                balance.refetch().catch(console.error);
                              },
                            }
                          );
                        }}
                      >
                        {api_enter_draw.isLoading ? (
                          <>
                            <Loading className="my-0.5 text-black" /> CONFIRMING
                          </>
                        ) : (
                          "ENTER THIS DRAW"
                        )}
                      </Button>
                    </div>
                    {fee.data && (
                      <span className="text-right text-xs">
                        tx fee -{fee.data.fee / LAMPORTS_PER_SOL}
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
