import { PublicKey } from "@solana/web3.js";
import { array_pick_range } from "~/utils/array_pick_range";
import { split_number_percentage } from "~/utils/split_number_percentage";
import { unique } from "moderndash";
export const solcity = {
  percentage_house_cut: 0.05,
  percentage_rollover: 0.1,
};

export function calculate_pot_splits(inputs: { lamports: number }) {
  if (!(inputs.lamports > 0)) {
    throw new Error("draw pot must have positive balance.");
  }

  const pot_split_house_cut = split_number_percentage({
    inputnumber: inputs.lamports,
    percentage: solcity.percentage_house_cut,
    integer: true,
  });

  const pot_after_house_cut = pot_split_house_cut.left;
  const pot_house_cut = pot_split_house_cut.right;

  const pot_split_rollover = split_number_percentage({
    inputnumber: pot_after_house_cut,
    percentage: solcity.percentage_rollover,
    integer: true,
  });

  const pot_actual = pot_split_rollover.left;
  const pot_rollover = pot_split_rollover.right;

  return {
    pot_balance_lamports: inputs.lamports,
    pot_house_cut,
    pot_rollover,
    pot_actual,
  };
}

export function calculate_winners(inputs: {
  pot_actual: number;
  entries: {
    publicKey: PublicKey;
    lamports_bet: number;
  }[];
}) {
  let pot_remaining = inputs.pot_actual;
  const winners: {
    publicKey: PublicKey;
    lamports_bet: number;
    lamports_win: number;
  }[] = [];

  while (pot_remaining > 0) {
    const winner = array_pick_range({
      input: inputs.entries,
      key: "lamports_bet",
    });
    if (!winner) throw new Error("Could not pick a winner..");
    const split = split_number_percentage({
      inputnumber: pot_remaining,
      percentage: pot_remaining < 50000 ? 1 : 0.1,
      integer: true,
    });

    pot_remaining = split.left;

    const lamports_win = split.right;

    winners.push({ ...winner, lamports_win });
  }

  // the same entry could be picked many times, so we group and merge the winnings so its fewer transactions.

  const winner_payouts = unique(winners.map((i) => i.publicKey)).map(
    (publicKey) => {
      const lamports_win_per_pubkey = winners
        .filter((i) => i.publicKey)
        .map((i) => i.lamports_win)
        .reduce((a, b) => a + b);
      return {
        publicKey,
        lamports_win_per_pubkey,
      };
    }
  );

  return {
    // inputs,
    winner_payouts,
    // winners,
  };
}
