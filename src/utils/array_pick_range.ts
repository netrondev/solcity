import { array_total } from "./array_total";
import { type KeyOfType } from "./type_helpers";

/** picks an item from an array based on per item scaling. */
export function array_pick_range<T>(props: {
  input: T[];
  key: KeyOfType<T, number>;
}): T | undefined {
  if (!props.input) return undefined;
  if (props.input.length === 0) return undefined;
  // generate a random number, lookup an item in T based on the scale of the key.
  // The larger the value of the key the larger the chance of being picked.
  // This insures many small inputs vs one large input have the same chance.

  const total = array_total(props.input.map((i) => Number(i[props.key])));
  const dice = Math.random() * total;

  const proc = props.input.map((inp, idx, arr) => {
    const val = Number(inp[props.key]);
    // const arr_to_here = arr.slice(0, idx);
    const total_to_here = array_total(
      arr.slice(0, idx).map((i) => Number(i[props.key]))
    );

    const picked = total_to_here <= dice && dice < total_to_here + val;

    return { inp, picked };
  });

  const item_picked = proc.find((i) => i.picked);

  if (!item_picked) throw new Error("Array pick range error.");

  return item_picked.inp;
}
