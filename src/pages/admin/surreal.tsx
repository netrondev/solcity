import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "~/components/Button";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

function TableInfo(props: { table: string }) {
  const info = api.surrealdb.info_for_tb.useQuery({ table: props.table });
  return (
    <Section>
      <Heading>{props.table}</Heading>
      <pre>{JSON.stringify(info.data, null, 2)}</pre>
    </Section>
  );
}

export default function SurrealUI() {
  const session = useSession();
  const [selectedTable, setSelectedTable] = useState<string>();
  const info = api.surrealdb.info.useQuery();
  const migration = api.surrealdb.migration.useMutation();
  if (!info.data) return <></>;

  return (
    <section>
      <Section>
        <Button
          onClick={() => {
            migration.mutate();
          }}
        >
          RUN DB MIGRATION
        </Button>
        <pre>{JSON.stringify(migration.data, null, 2)}</pre>
      </Section>

      <Heading>SESSION</Heading>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Heading>KV</Heading>
      <pre>{JSON.stringify(info.data.kv, null, 2)}</pre>
      <Heading>NS</Heading>
      <pre>{JSON.stringify(info.data.ns, null, 2)}</pre>
      <Heading>DB</Heading>
      <pre>{JSON.stringify(info.data.db, null, 2)}</pre>
      <Section>
        <Heading>TABLES</Heading>
        <div className="flex flex-wrap gap-1">
          {Object.entries(info.data.db.tables).map(([table, definition]) => (
            <Button
              key={table}
              active={table === selectedTable}
              onClick={() => {
                setSelectedTable(table);
              }}
            >
              {table}
            </Button>
          ))}
        </div>

        {selectedTable && <TableInfo table={selectedTable} />}
      </Section>
    </section>
  );
}
