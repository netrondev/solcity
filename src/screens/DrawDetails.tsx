import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import { DrawDisplay } from "./DrawDisplay";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { DrawEntries } from "./DrawEntries";

export function DrawDetails() {
  const router = useRouter();
  const { draw_id } = router.query;

  const drawList = api.solcity.draws.list.useQuery();

  const draw = drawList.data?.find((d) => d.id.endsWith(draw_id as string));

  if (!draw)
    return (
      <AiOutlineLoading3Quarters className="animate-spin text-emerald-500" />
    );

  return (
    <Section>
      <Heading>Draw Details</Heading>
      <DrawDisplay draw={draw} />
      <DrawEntries draw={draw} />
    </Section>
  );
}
