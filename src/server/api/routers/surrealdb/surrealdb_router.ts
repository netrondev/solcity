import { getDB } from "~/server/db";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const surrealdb_router = createTRPCRouter({
  migration: adminProcedure.mutation(async ({ ctx }) => {
    const dbc = await getDB();

    // const result = await dbc.query(`DEFINE SCOPE account SIGNIN { SELECT * FROM }`);

    // const result = await dbc.query(
    //   `SELECT user.id as id FROM ONLY (SELECT *, userId AS user FROM session WHERE sessionToken = "${ctx.session.user.sessionToken}" FETCH user);`
    // );

    const result = await dbc.query(
      `DEFINE SCOPE account SIGNIN (
        SELECT user.id as id FROM ONLY (SELECT *, userId AS user FROM session WHERE sessionToken = $pass FETCH user)
      );
      DEFINE TABLE private SCHEMALESS
        PERMISSIONS
        FOR create, update, select, delete
          WHERE $scope = "account" AND user = $auth
      ;
      DEFINE FIELD user on TABLE private VALUE $auth;
      DEFINE TABLE public SCHEMALESS
        PERMISSIONS
        FOR create, update, select, delete
          WHERE $scope = "account"
      ;
      DEFINE FIELD user ON TABLE public value $auth;
      `
    );

    return result;
  }),
  info: adminProcedure.query(async () => {
    const dbc = await getDB();

    const kv = await dbc
      .query<
        [{ namespaces: Record<string, string>; users: Record<string, string> }]
      >("INFO FOR KV;")
      .then((i) => i.at(0)!.result!);

    const ns = await dbc
      .query<
        [
          {
            databases: Record<string, string>;
            tokens: Record<string, string>;
            users: Record<string, string>;
          }
        ]
      >("INFO FOR NS;")
      .then((i) => i.at(0)!.result!);

    const db = await dbc
      .query<
        [
          {
            analyzers: Record<string, string>;
            functions: Record<string, string>;
            params: Record<string, string>;
            scopes: Record<string, string>;
            tables: Record<string, string>;
            tokens: Record<string, string>;
            users: Record<string, string>;
          }
        ]
      >("INFO FOR DB;")
      .then((i) => i.at(0)!.result!);

    return { kv, ns, db };
  }),
  info_for_tb: adminProcedure
    .input(z.object({ table: z.string() }))
    .query(async ({ input }) => {
      const dbc = await getDB();

      const tb = await dbc
        .query(`INFO FOR TABLE ${input.table};`)
        .then((i) => i.at(0)!.result!);

      const rows = await dbc
        .query(`SELECT * FROM ${input.table};`)
        .then((i) => i.at(0)!.result!);

      return { tb, rows };
    }),
});
