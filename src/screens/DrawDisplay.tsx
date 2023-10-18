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
import { sum } from "moderndash";
import Image from "next/image";
import { DrawEntries } from "./DrawEntries";

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

  const balance = api.solana.wallet.get_balance.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const [enter_lamports, setEnterSol] = useState(0);

  const api_enter_draw = api.solcity.draws.enter_draw.useMutation();

  const fee = api.solana.getFeePrediction.useQuery({
    toPubkey: draw.publicKey,
    lamports: 1000000, // static because else its many queries..
  });

  const history = api.solana.wallet.GetTransactionHistory.useQuery({
    publicKey: draw.publicKey,
  });

  // YOUR ENTRIES
  const your_entries = history.data?.filter(
    (i) =>
      i.source === session.data?.user.publicKey &&
      i.destination === draw.publicKey
  );
  const your_entry_total = sum(
    your_entries?.map((i) => i.totalChangeAmount) ?? [0]
  );

  // const userLamports = appState.balance_lamports
  //   ? appState.balance_lamports
  //   : 0;

  // const feeprediction = feeprediction_query.data?.fee ?? 5000;
  // const userLamportsMaxMinusFee = userLamports - feeprediction;

  return (
    <div>
      <div className="mx-auto mt-16 max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {draw.is_closed && <Heading>Past Draw</Heading>}
          {draw.is_next && <Heading>Current Draw</Heading>}
        </h2>
        <div className=" text-4xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          <SolanaPublicInfo onlyString publicKey={draw.publicKey} />
        </div>
      </div>

      {/* {draw.is_open && (
        <Section className="bg-blue-400">
          <Section className="shadow-none">
            <div className="flex flex-row items-center gap-1">
              <Input
                type="number"
                value={enter_lamports / LAMPORTS_PER_SOL}
                className="w-full appearance-none"
                max={balance.data?.lamports}
                onChange={(e) => {
                  if (!balance.data?.lamports) return;
                  if (!fee.data) return;

                  let lamports = e.target.valueAsNumber * LAMPORTS_PER_SOL;

                  const max = balance.data.lamports - fee.data.fee;

                  if (lamports > max) lamports = max;
                  if (lamports < fee.data.fee * 2) lamports = fee.data.fee * 2;
                  // console.log(lamports);
                  // if (!appState.balance_lamports) return;
                  setEnterSol(lamports);
                }}
              />
              <Button
                // className="bg-emerald-500 bg-emerald-500/10 text-gray-900 hover:bg-emerald-500/20 hover:text-emerald-300 dark:text-emerald-500"
                disabled={session.status != "authenticated"}
                onClick={() => {
                  if (!balance.data?.lamports) return;
                  if (!fee.data) return;

                  setEnterSol(balance.data?.lamports - fee.data.fee);
                }}
              >
                MAX
              </Button>
              <Button
                disabled={
                  api_enter_draw.isLoading || session.status != "authenticated"
                }
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

          {your_entry_total > 0 && (
            <>
              <span>YOUR ENTRY</span>
              <span className="text-3xl font-bold">
                {your_entry_total / LAMPORTS_PER_SOL} SOL
              </span>
            </>
          )}
        </Section>
      )} */}

      <div className="mx-auto mt-12 max-w-7xl sm:mt-20 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6  text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <div className="pb-14 pt-6 text-3xl">
            Draw in {draw.is_next && <Countdown target={draw.draw_datetime} />}
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              {/* left side */}
              <div className="lg:max-w-lg">
                {/* start of first box */}
                {draw.is_open && (
                  <div className="h-max rounded-2xl bg-sky-950 p-5">
                    <div className=" items-center gap-1">
                      <Input
                        type="number"
                        value={enter_lamports / LAMPORTS_PER_SOL}
                        className="w-full rounded-xl bg-blue-900 p-2"
                        max={balance.data?.lamports}
                        onChange={(e) => {
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
                      <div className="mx-auto mt-5 flex flex-row items-center gap-6">
                        <button
                          className="rounded-xl border border-white bg-blue-900 p-2 pl-3 pr-3 text-white hover:border-none hover:bg-blue-400"
                          disabled={session.status != "authenticated"}
                          onClick={() => {
                            if (!balance.data?.lamports) return;
                            if (!fee.data) return;

                            setEnterSol(balance.data?.lamports - fee.data.fee);
                          }}
                        >
                          MAX
                        </button>
                        <button
                          className="rounded-xl border border-white bg-blue-700 p-2 pl-3 pr-3 text-white hover:border-none hover:bg-blue-400"
                          disabled={
                            api_enter_draw.isLoading ||
                            session.status != "authenticated"
                          }
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
                              <Loading className="my-0.5 text-black" />{" "}
                              CONFIRMING
                            </>
                          ) : (
                            "ENTER THIS DRAW"
                          )}
                        </button>
                        <div className="flex-none">
                          {your_entry_total > 0 && (
                            <>
                              <div className="text-xs">YOUR ENTRY</div>
                              <div className="text-xs font-bold">
                                {your_entry_total / LAMPORTS_PER_SOL} SOL
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      {fee.data && (
                        <span className=" text-xs">
                          tx fee -{fee.data.fee / LAMPORTS_PER_SOL}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-sm opacity-50">
                        {moment(draw.draw_datetime).format(
                          "Do MMM YYYY [at] h:mm a"
                        )}
                        &nbsp;
                        {Intl.DateTimeFormat().resolvedOptions().timeZone} time
                      </span>
                    </div>
                  </div>
                )}
                {/* end of first box */}
              </div>
            </div>
            {/* right side */}
            <Image
              className=" "
              src="/assets/images/solanacoin.png"
              alt={"Sol City"}
              width={2432}
              height={1442}
            />{" "}
            {/* {showLink && (
              <Button href={`/draw/${draw.id.split(":")[1]!}`}>View</Button>
            )} */}
          </div>
          <div
            className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
              style={{
                clipPath:
                  "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
              }}
            />
          </div>
          <DrawEntries draw={draw} />
        </div>
      </div>
    </div>
  );
}
