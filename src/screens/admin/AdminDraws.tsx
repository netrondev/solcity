import moment from "moment";
import { useState } from "react";
import Button from "~/components/Button";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";
import { Table } from "~/components/Table";
import { Heading } from "~/components/Heading";

function AdminCreateDraw() {
  const [draw_datetime, setDrawDate] = useState<Date>(
    moment().utc(false).startOf("day").add(12, "hours").add(7, "days").toDate()
  );

  const create_draw = api.solcity.draws.create_draw.useMutation();
  const draws = api.solcity.draws.list.useQuery();
  const clear_draws = api.solcity.draws.clear_draws.useMutation();

  return (
    <Section>
      <Heading>Create new Draw</Heading>
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

        <Button
          onClick={() => {
            void clear_draws.mutate();
          }}
        >
          Clear Draws
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
      <Table
        data={draws.data ?? []}
        columns={[
          {
            accessorKey: "id",
          },
          {
            accessorKey: "is_closed",
            header: "status",
            cell: (c) => {
              if (c.row.original.is_last) return <span>last</span>;
              if (c.row.original.is_next) return <span>next</span>;
              if (c.row.original.is_closed) return <span>closed</span>;
              if (c.row.original.is_open) return <span>open</span>;
              return <span>invalid</span>;
            },
          },
          {
            accessorKey: "publicKey",
            header: "Balance",
            cell: (c) => {
              return (
                <SolanaPublicInfo
                  publicKey={c.row.original.publicKey}
                  onlyString
                />
              );
            },
          },
          {
            accessorKey: "draw_datetime",
            cell: (c) => {
              return (
                <span>{moment(c.row.original.draw_datetime).fromNow()}</span>
              );
            },
          },
          {
            accessorKey: "id",
            cell: (c) => {
              return (
                <Button
                  href={`/draw/${c.row.original.id.split(":")[1]!}`}
                  className="p-0 px-1"
                >
                  details
                </Button>
              );
            },
          },
        ]}
      />
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
