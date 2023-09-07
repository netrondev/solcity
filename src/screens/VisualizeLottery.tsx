import { type Entry } from "~/validation/Entry";
import { VisualizeEntries } from "./VisualizeEntries";
import { lottery_calculate_winners, lottery_pot } from "~/utils/lottery";
import { DisplayData } from "./DisplayData";
import { array_pick_range } from "~/utils/array_pick_range";
import { Heading } from "~/components/Heading";

export function VisualizeLottery(props: { entries: Entry[] }) {
  // todo rollover
  const data = lottery_pot({ entries: props.entries, previous_rollover: 5 });

  const winners = lottery_calculate_winners({
    entries: props.entries,
    pot_actual: data.pot_actual,
  });

  return (
    <section>
      <Heading>ENTRIES</Heading>
      <VisualizeEntries
        entries={props.entries}
        id_key="user"
        valuekey="amount"
      />
      <div className="flex flex-wrap gap-2.5 rounded-2xl bg-white/5 p-2 text-white">
        {/* POT BREAKDOWN */}

        <DisplayData
          label={`Rollover from last lottery`}
          value={data.pot_rollover}
          unit="SOL"
        />

        <DisplayData
          label={`Total entries ${props.entries.length}`}
          value={data.pot_total}
          unit="SOL"
        />

        <DisplayData
          label={`House Cut ${data.percentage_house_cut}%`}
          value={data.pot_house_cut}
          unit="SOL"
        />

        <DisplayData
          label={`Rollover to next lottery ${data.percentage_rollover}%`}
          value={data.pot_rollover}
          unit="SOL"
        />

        <DisplayData
          label={`Actual Lottery Pot`}
          value={data.pot_actual}
          unit="SOL"
        />
      </div>

      <Heading>POT SPLIT</Heading>
      <VisualizeEntries
        entries={[
          {
            id: "pot_house_cut",
            label: "House",
            amount: data.pot_house_cut,
          },
          {
            id: "pot_rollover",
            label: "Rollover",
            amount: data.pot_rollover,
          },
          { id: "pot_actual", label: "Pot", amount: data.pot_actual },
        ]}
        id_key="id"
        valuekey="amount"
        label_key="label"
      />

      {/* <pre>
        {JSON.stringify(
          array_pick_range({ input: props.entries, key: "amount" }),
          null,
          2
        )}
      </pre> */}

      <span>Winners Simulation:</span>

      <VisualizeEntries
        entries={winners}
        id_key="id_payout"
        valuekey="payout"
        label_key="payout_message"
      />
    </section>
  );
}
