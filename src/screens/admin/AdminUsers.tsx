import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";
import { adminusers } from "~/server/adminusers";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";

export function AdminUsers() {
  const session = useSession();

  const users = api.solcity.users.list.useQuery();

  //users names

  const adminUsers = adminusers;
  const table = useReactTable({
    data:
      users.data?.map((i) => ({
        ...i,
        is_admin: adminusers.includes(i.email),
      })) ?? [],
    columns: [
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "id",
        header: "Id",
      },
      {
        accessorKey: "is_admin",
        header: "Admin",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "emailVerified",
        header: "Verified",
        cell: (c) => {
          return (
            <pre>{JSON.stringify(c.row.original.emailVerified, null, 2)}</pre>
          );
        },
      },
      //  {
      //    accessorKey: "draw_datetime",
      //    cell: (c) => {
      //      return <span>{moment(c.row.original.draw_datetime).fromNow()}</span>;
      //    },
      //  },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Section>
      <Heading>User List</Heading>
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
                <td key={cell.id} className="border border-neutral-500 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
