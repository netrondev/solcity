import { clear } from "console";
import moment from "moment";
import { useState } from "react";
import Button from "~/components/Button";
import { Input } from "~/components/Input";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";

function AdminCreateDraw() {
  const [draw_datetime, setDrawDate] = useState<Date>(
    moment().utc(false).startOf("day").add(12, "hours").add(7, "days").toDate()
  );

  const create_draw = api.solcity.draws.create_draw.useMutation();
  const draws = api.solcity.draws.list.useQuery();
  const clear_draws = api.solcity.draws.clear_draws.useMutation();

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

  const table = useReactTable({
    data: draws.data ?? [],
    columns: [
      {
        accessorKey: "id",
      },
      {
        accessorKey: "publicKey",
        header: "Balance",
        cell: (c) => {
          return (
            <SolanaPublicInfo publicKey={c.row.original.publicKey} onlyString />
          );
        },
      },
      {
        accessorKey: "draw_datetime",
        cell: (c) => {
          return <span>{moment(c.row.original.draw_datetime).fromNow()}</span>;
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Section>
      <table className="text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
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
