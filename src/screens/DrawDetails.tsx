import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import { DrawDisplay } from "./DrawDisplay";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { DrawEntries } from "./DrawEntries";
import { useSession } from "next-auth/react";
import Button from "~/components/Button";

export function DrawDetails() {
  const router = useRouter();
  const session = useSession();
  const { draw_id } = router.query as { draw_id: string };
  const drawList = api.solcity.draws.list.useQuery();
  const draw = drawList.data?.find((d) => d.id.endsWith(draw_id));
  const run_draw = api.solcity.draws.run_draw.useMutation();

  if (!draw)
    return (
      <AiOutlineLoading3Quarters className="animate-spin text-emerald-500" />
    );

  return (
    <Section>
      <div className="flex items-center justify-between">
        <Heading>Draw Details</Heading>
        {session.data?.user.is_admin && (
          <Button
            className="py-0"
            onClick={() => {
              run_draw.mutate({
                draw_id,
              });
            }}
          >
            RUN ALGO
          </Button>
        )}
      </div>
      <DrawDisplay draw={draw} />
      <DrawEntries draw={draw} />

      {/* <pre>{JSON.stringify(run_draw.data, null, 2)}</pre> */}
    </Section>
  );
}
