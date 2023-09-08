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
import { Table } from "~/components/Table";

export function AdminUsers() {
  const users = api.solcity.users.list.useQuery();

  return (
    <Section>
      <Heading>User List</Heading>
      <Table
        data={
          users.data?.map((i) => ({
            ...i,
            is_admin: adminusers.includes(i.email),
          })) ?? []
        }
        columns={[
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
                <pre>
                  {JSON.stringify(c.row.original.emailVerified, null, 2)}
                </pre>
              );
            },
          },
        ]}
      />
    </Section>
  );
}
