import { type Key } from "react";
import { array_total } from "~/utils/array_total";
import { type KeyOfType } from "~/utils/type_helpers";
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

export function VisualizeEntries<T>(props: {
  entries: T[];
  valuekey: KeyOfType<T, number>;
  id_key: KeyOfType<T, Key>;
  label_key?: KeyOfType<T, string>;
}) {
  const total = array_total(
    props.entries.map((i) => Number(i[props.valuekey]))
  );
  return (
    <div className="flex flex-col gap-2 py-10 text-white">
      <div className="flex h-10 w-full bg-red-500">
        {props.entries.map((entry) => {
          return (
            <div
              key={String(entry[props.id_key])}
              className="overflow-hidden"
              style={{
                width: `${(Number(entry[props.valuekey]) / total) * 100}%`,
                background: get_random_color(),
              }}
            >
              <div className="h-full w-full whitespace-nowrap border-x border-black/20 p-1 text-black">
                {props.label_key && String(entry[props.label_key])}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
