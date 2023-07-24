import { useState } from "react";
import { PotDisplay } from "./PotDisplay";
import { Button } from "./Button";
import { Input } from "./Input";
import { array_total } from "~/utils/array_total";

import { type Entry } from "~/validation/Entry";
import { VisualizeLottery } from "./VisualizeLottery";
import { generate_dummy_entries } from "~/utils/generate_dummy_entries";

//choose winners from entries

export function LotteryPage() {
  const [entries, entries_set] = useState<Entry[]>([]);
  const [bet_size, bet_size_set] = useState(0);
  const pot_total = array_total(entries.map((i) => i.amount));

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
            const dummyentries = generate_dummy_entries(100);
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

      <VisualizeLottery entries={entries} />

      <div className="py-5">
        <Button
          onClick={() => {
            // run_lottery({ entries });
          }}
        >
          Run Lottery
        </Button>
      </div>
    </div>
  );
}
