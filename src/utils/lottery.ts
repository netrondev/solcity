import { type Entry } from "~/validation/Entry";
import { array_total } from "./array_total";
import { split_number_percentage } from "./split_number_percentage";

import { array_pick_range } from "./array_pick_range";

type LotteryResult = {
  entries: Entry[];
  pot_total: number;
  timestamp: Date;
  winners: (Entry & { payout: number })[];
  /** The amount left over to start the next pot. */
  pot_next: number;
};

export function lottery_pot(props: {
  entries: Entry[];
  previous_rollover: number;
}) {
  // calculate house cut
  const pot_total = array_total(props.entries.map((i) => i.amount));

  const percentage_house_cut = 5;

  const pot_split_house_cut = split_number_percentage({
    inputnumber: pot_total,
    percentage: 1 - percentage_house_cut / 100,
  });

  const pot_house_cut = pot_split_house_cut.left;
  const pot_after_house_cut = pot_split_house_cut.right;

  // calculate next pot cut
  const percentage_rollover = 10;

  const pot_split_rollover = split_number_percentage({
    inputnumber: pot_after_house_cut,
    percentage: 1 - percentage_rollover / 100,
  });

  const pot_rollover = pot_split_rollover.left;
  const pot_actual = pot_split_rollover.right;
  // left over for this pot:

  const output = {
    pot_total,
    percentage_house_cut,
    percentage_rollover,
    pot_house_cut,
    pot_after_house_cut,
    pot_rollover,
    pot_actual,
    timestamp: new Date(),

    // entries: props.entries,
  };

  return output;
}

export function lottery_calculate_winners(props: {
  entries: Entry[];
  pot_actual: number;
}) {
  let pot_remaining = props.pot_actual;
  const winners = [];

  while (pot_remaining > 0) {
    const winner = array_pick_range({ input: props.entries, key: "amount" });

    if (!winner) throw new Error("Could not pick a winner..");

    const split = split_number_percentage({
      inputnumber: pot_remaining,
      percentage: pot_remaining < 0.01 ? 1 : 0.1,
    });

    pot_remaining = split.left;

    const id_payout = crypto.randomUUID();

    const payout = split.right;

    const payout_message = `${winner.amount.toFixed(2)} to ${payout.toFixed(
      2
    )}`;

    winners.push({ ...winner, id_payout, payout, payout_message });
  }

  return winners;
}
