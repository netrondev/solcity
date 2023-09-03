import moment from "moment";
import { useState } from "react";
import Button from "~/components/Button";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

function AdminCreateDraw() {
  const [draw_datetime, setDrawDate] = useState<Date>(
    moment().utc(false).startOf("day").add(12, "hours").add(7, "days").toDate()
  );

  const create_draw = api.solcity.draws.create_draw.useMutation();
  const draws = api.solcity.draws.list.useQuery();

  return (
    <Section>
      <h1>Create new Draw</h1>
      <div className="flex items-center gap-2">
        <Input
          type="datetime-local"
          value={moment(draw_datetime).format("YYYY-MM-DD[T]HH:mm")}
          onChange={(e) => {
            setDrawDate(new Date(e.target.value));
          }}
        />

        <Button
          onClick={() => {
            void create_draw.mutateAsync({ draw_datetime }).then(() => {
              void draws.refetch();
            });
          }}
        >
          Create Draw {moment(draw_datetime).fromNow()}
        </Button>
      </div>

      <span>{create_draw.status}</span>
    </Section>
  );
}

function AdminDrawList() {
  const draws = api.solcity.draws.list.useQuery();
  return (
    <Section>
      <h1>Draw List</h1>
      <pre>{JSON.stringify(draws.data, null, 2)}</pre>
    </Section>
  );
}

export function AdminDraws() {
  return (
    <Section>
      <AdminCreateDraw />
      <AdminDrawList />
    </Section>
  );
}
