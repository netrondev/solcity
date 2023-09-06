import { Section } from "~/components/Section";
import { api } from "~/utils/api";
import { DrawDisplay } from "./DrawDisplay";

export function DrawCurrent() {
  const drawList = api.solcity.draws.list.useQuery();

  if (!drawList.data) return <></>;

  return (
    <div className="text-left">
      {drawList.data
        ?.filter((i) => i.is_next)
        .map((draw) => (
          <DrawDisplay key={draw.id} draw={draw} />
        ))}
    </div>
  );
}
