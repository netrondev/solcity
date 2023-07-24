import { type Entry } from "~/validation/Entry";
import { array_total } from "./array_total";
import { split_number_percentage } from "./split_number_percentage";

type LotteryResult = {
  entries: Entry[];
  pot_total: number;
  timestamp: Date;
  winners: (Entry & { payout: number })[];
  /** The amount left over to start the next pot. */
  pot_next: number;
};

function add_entries_to_pot_total(props: { entries: Entry[] }): number {
  const pot_total = array_total(props.entries.map((i) => i.amount));
  return pot_total;
}

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
  const percentage_rollover = 20;

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
