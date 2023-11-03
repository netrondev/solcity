import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import Button from "~/components/Button";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

export function WithdrawScreen() {
  const [toPubkey, setToPubkey] = useState<string>("");
  const [lamports, setLamports] = useState<number | undefined>();

  const wallet_withdraw_api = api.solana.wallet.withdraw.useMutation();

  return (
    <div className="relative isolate mx-auto max-w-3xl overflow-hidden bg-gray-900 p-5 px-6 pt-2 text-center shadow-2xl sm:rounded-3xl sm:px-16">
      <Heading>Withdraw</Heading>

      <p className="p-5 text-xs opacity-90">
        WARNING, double check your wallet target address. Amount entered will be
        sent, but an additional small fee will be deducted to process the
        transaction.
      </p>
      <Input
        className="mb-5"
        value={toPubkey}
        placeholder="Enter target wallet address"
        onChange={(e) => {
          setToPubkey(e.target.value);
        }}
      />
      <Input
        className="mb-5"
        type="number"
        value={lamports ? lamports / LAMPORTS_PER_SOL : undefined}
        placeholder="Enter amount to withdraw. ex: 0.0001"
        onChange={(e) => {
          setLamports(e.target.valueAsNumber * LAMPORTS_PER_SOL);
        }}
      />
      <Button
        onClick={() => {
          if (!lamports) return;
          wallet_withdraw_api.mutate({ toPubkey, lamports });
        }}
      >
        SEND
      </Button>
      {wallet_withdraw_api.isSuccess && wallet_withdraw_api.data && (
        <Button href={`https://solscan.io/tx/${wallet_withdraw_api.data}`}>
          VIEW ON SOLCAN
        </Button>
      )}
      <div
        className="absolute -top-24 right-0 -z-10 transform-gpu animate-pulse blur-3xl"
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
    </div>
  );
}
