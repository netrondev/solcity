import { getDB } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const surrealdb_router = createTRPCRouter({
  // test: publicProcedure.query(async () => {
  //   const db = await getDB().catch((error) => {
  //     if (error instanceof Error) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: `could not get db ${error.message}`,
  //       });
  //     }
  //   });
  //   if (!db)
  //     return new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "could not connect to surreal",
  //     });
  //   const kvinfo = await db.query("INFO FOR DB;");
  //   return { testapi: true, kvinfo };
  // }),
});
