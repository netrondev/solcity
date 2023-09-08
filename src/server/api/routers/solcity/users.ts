import { getDB } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const db = await getDB();

    const command = await db.query<
      [
        {
          email: string;
          emailVerified: Date | null;
          id: string;
          image: string;
          name: string;
        }[]
      ]
    >(`SELECT * FROM user;`);

    return command[0].result;
  }),
});
