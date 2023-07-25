import { NoSSR } from "~/components/NoSSR";
import { array_pick_range } from "~/utils/array_pick_range";

export function DevPage() {
  const output = array_pick_range({
    input: [
      { id: "a", test: 1 },
      { id: "b", test: 5 },
      { id: "c", test: 2 },
      { id: "d", test: 0.1 },
    ],
    key: "test",
  });

  return (
    <div>
      <pre className="text-xs">{JSON.stringify(output, null, 2)}</pre>
    </div>
  );
}

export default function Page() {
  return (
    <NoSSR>
      <DevPage />
    </NoSSR>
  );
}
