import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import Button from "~/components/Button";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

export function WithdrawScreen() {
  const [toPubkey, setToPubkey] = useState<string>("");
  const [lamports, setLamports] = useState<number | undefined>();

  const wallet_withdraw_api = api.solana.wallet.withdraw.useMutation();

  return (
    <Section>
      Withdraw Address:
      <p className="text-xs opacity-50">
        WARNING, double check your wallet target address. Amount entered will be
        sent, but an additional small fee will be deducted to process the
        transaction.
      </p>
      <Input
        value={toPubkey}
        placeholder="Enter target wallet address"
        onChange={(e) => {
          setToPubkey(e.target.value);
        }}
      />
      <Input
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
    </Section>
  );
}
