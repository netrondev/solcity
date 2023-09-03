import { getDB } from "~/server/db";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { env } from "~/env.mjs";

export const authSurrealRouter = createTRPCRouter({
  listdata: adminProcedure.query(async () => {
    const db = await getDB();
    const data = (await db.query("INFO FOR KV;INFO FOR NS;INFO FOR DB;")) as {
      result: { tables: object };
    }[];
    if (!data.at(2)) return;
    if (!data.at(2)?.result) return;

    const asdf = data.at(2)?.result?.tables;

    if (!asdf) return;

    const tables = Object.keys(asdf);

    const datatables = await Promise.all(
      tables.map((table) => db.query(`SELECT * FROM ${table};`))
    );

    return datatables;
  }),
  clearauth: adminProcedure.mutation(async () => {
    const client = await getDB();
    const result = await client.query(`REMOVE DATABASE ${env.SURREALDB_DB};`);
    return result;
  }),
});
