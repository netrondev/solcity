import { array_total } from "~/utils/array_total";
import { type Entry } from "~/validation/Entry";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function get_random_color() {
  const h = rand(1, 360);
  const s = rand(50, 100);
  const l = rand(30, 80);
  return `hsl(${h},${s}%,${l}%)`;
}

export function VisualizeEntries(props: {
  entries: { id: string; amount: number; label?: string }[];
}) {
  const total = array_total(props.entries.map((i) => i.amount));
  return (
    <div className="flex flex-col gap-2 py-10 text-white">
      <div className="flex h-10 w-full bg-red-500">
        {props.entries.map((entry) => (
          <div
            key={entry.id}
            className="overflow-hidden"
            style={{
              width: `${(entry.amount / total) * 100}%`,
              background: get_random_color(),
            }}
          >
            <div className="h-full w-full whitespace-nowrap border-x border-black/20 p-1 text-black">
              {entry.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
