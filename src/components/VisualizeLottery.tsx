import { type Entry } from "~/validation/Entry";
import { VisualizeEntries } from "./VisualizeEntries";
import { lottery_pot } from "~/utils/lottery_pot";
import { DisplayData } from "./DisplayData";

export function VisualizeLottery(props: { entries: Entry[] }) {
  // todo rollover
  const data = lottery_pot({ entries: props.entries, previous_rollover: 5 });

  return (
    <section>
      <VisualizeEntries entries={props.entries} />
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
      />
    </section>
  );
}
