import moment from "moment";
import Button from "~/components/Button";
import { Countdown } from "~/components/Countdown";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

export function DrawCurrent() {
  const current_draw = api.solcity.draws.current.useQuery();

  if (!current_draw.data) return <></>;

  return (
    <Section className="text-center">
      <Heading>Current Draw</Heading>
      <span className="text-3xl font-bold">627.34545 SOL</span>
      <Countdown target={current_draw.data.draw_datetime} />
      <span className="text-sm opacity-50">
        {moment(current_draw.data.draw_datetime).format(
          "Do MMM YYYY [at] h:mm a"
        )}
        &nbsp;
        {Intl.DateTimeFormat().resolvedOptions().timeZone} time
      </span>

      <Section>
        <Button className="self-center">ADD ENTRY</Button>
        <span>YOUR ENTRY</span>
        <span className="text-3xl font-bold">2.523 SOL</span>
      </Section>
    </Section>
  );
}
