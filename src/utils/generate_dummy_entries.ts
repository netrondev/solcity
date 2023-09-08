import { type Entry } from "~/validation/Entry";
import { range } from "./range";

export function generate_dummy_entries(count: number): Entry[] {
  const blah = range(count);

  return blah.map(() => {
    const newentry: Entry = {
      id: crypto.randomUUID(),
      amount: Math.random(),
      timestamp: new Date(),
      user: crypto.randomUUID(),
    };

    return newentry;
  });
}
