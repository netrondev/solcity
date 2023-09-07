import { type Key } from "react";
import { array_total } from "~/utils/array_total";
import { type KeyOfType } from "~/utils/type_helpers";

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
    <div className="flex flex-col gap-2 text-white">
      <div className="flex h-2 w-full gap-0.5">
        {props.entries.map((entry) => {
          return (
            <div
              key={String(entry[props.id_key])}
              className="rounded-sm"
              style={{
                width: `${(Number(entry[props.valuekey]) / total) * 100}%`,
                background: get_random_color(),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
