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
      <Disclosure as="div" className="pt-6">
        {({ open }) => (
          <>
            <dt>
              <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                {open ? (
                  <Button>Close past draws</Button>
                ) : (
                  <Button>View all past draws</Button>
                )}
              </Disclosure.Button>
            </dt>
            <Disclosure.Panel as="dd" className="mt-2 ">
              <DrawHistory />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {drawList.data
        ?.filter((i) => !i.is_open)
        //only show 3 draws
        .reverse()
        .slice(0, 1)
        .reverse()
        .map((draw) => (
          <DrawDisplay key={draw.id} draw={draw} />
        ))}

      {drawList.data
        ?.filter((i) => i.is_next)
        .map((draw) => (
          <DrawDisplay key={draw.id} draw={draw} />
        ))}
    </div>
  );
}
