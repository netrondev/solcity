import { api } from "~/utils/api";
import { DrawDisplay } from "./DrawDisplay";
import { Disclosure } from "@headlessui/react";
import Button from "~/components/Button";
import { DrawHistory } from "./DrawHistory";

export function DrawCurrent() {
  const drawList = api.solcity.draws.list.useQuery();

  if (!drawList.data) return <></>;

  return (
    <div className="text-left">
      {/* {drawList.data
        ?.filter((i) => !i.is_open)
        //only show 3 draws
        .reverse()
        .slice(0, 1)
        .reverse()
        .map((draw) => (
          <DrawDisplay key={draw.id} draw={draw} />
        ))} */}

      {drawList.data
        ?.filter((i) => i.is_next)
        .map((draw) => (
          <DrawDisplay key={draw.id} draw={draw} />
        ))}

      <div className="hidden">
        <DrawHistory />
      </div>
    </div>
  );
}
