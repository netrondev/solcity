import { useState } from "react";
import { PotDisplay } from "./PotDisplay";
import { Button } from "./Button";
import { Input } from "./Input";
import { array_total } from "~/utils/array_total";
import { range } from "~/utils/range";

type Entry = {
  id: string;
  timestamp: Date;
  amount: number;
  user: string;
};

function generateDummyEntries(count: number): Entry[] {
  const blah = range(count);

  return blah.map((i) => {
    const newentry: Entry = {
      id: crypto.randomUUID(),
      amount: Math.random(),
      timestamp: new Date(),
      user: crypto.randomUUID(),
    };

    return newentry;
  });
}

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

function split_number_percentage(props: {
  inputnumber: number;
  percentage: number;
}): { left: number; right: number } {
  const left = props.inputnumber * (1 - props.percentage);
  const right = props.inputnumber - left;

  const result = {
    left,
    right,
  };
  return result;
}

function run_lottery(props: { entries: Entry[] }): LotteryResult {
  const pot_total = add_entries_to_pot_total({ entries: props.entries });

  const pot_split_profit = split_number_percentage({
    inputnumber: pot_total,
    percentage: 0.05,
  });

  const pot_next = pot_split_profit.left;
  const profits = pot_split_profit.right;

  const lottery_result: LotteryResult = {
    entries: props.entries,
    pot_total,
    timestamp: new Date(),
    winners: [],
    pot_next,
  };

  return lottery_result;
}

export function LotteryPage() {
  const [entries, entries_set] = useState<Entry[]>([]);

  const [bet_size, bet_size_set] = useState(0);

  const pot_total = add_entries_to_pot_total({ entries });

  return (
    <div className="h-screen bg-zinc-800 p-10">
      <PotDisplay pot_total={pot_total} />

      <div className="my-5 flex gap-5">
        <Input
          value={bet_size}
          type="number"
          onChange={(e) => {
            bet_size_set(e.target.valueAsNumber);
          }}
        />

        <Button
          onClick={() => {
            //   pot_total_set(pot_total + bet_size);

            const newentry: Entry = {
              id: crypto.randomUUID(),
              amount: bet_size,
              timestamp: new Date(),
              user: crypto.randomUUID(),
            };

            entries_set([...entries, newentry]);
          }}
        >
          PLACE BET
        </Button>

        <Button
          onClick={() => {
            const dummyentries = generateDummyEntries(100);
            entries_set([...entries, ...dummyentries]);
          }}
        >
          Generate Random Entries
        </Button>
      </div>

      <div className="h-[300px] overflow-auto bg-white/10">
        <table className="w-full  text-white">
          {entries?.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.user} </td>
              <td>{entry.timestamp.toISOString()} </td>
              <td>{entry.amount} SOL</td>
            </tr>
          ))}
        </table>
      </div>

      <div className="py-5">
        <Button onClick={() => {}}>Run Lottery</Button>
      </div>
    </div>
  );
}
