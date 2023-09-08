import { getDB } from "~/server/db";
import { adminProcedure, createTRPCRouter } from "../../trpc";

export const usersRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
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
