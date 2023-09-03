import { z } from "zod";
import {
  createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { TRPCError } from "@trpc/server";
import { getDB } from "~/server/db";

export const drawsRouter = createTRPCRouter({
  create_draw: protectedProcedure
    .input(z.object({ draw_datetime: z.date() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.is_admin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const db = await getDB();
      const created = await db.create("draws", input);
      return created;
    }),

  list: protectedProcedure.query(async () => {
    const db = await getDB();

    const draws = await db.select("draws");

    const parsed = z
      .array(z.object({ draw_datetime: z.coerce.date(), id: z.string() }))
      .parse(draws);

    return parsed;
  }),
  current: publicProcedure.query(async () => {
    const db = await getDB();

    const draw = await db.query(
      `SELECT * FROM draws WHERE draw_datetime > time::now() ORDER BY draw_datetime ASC LIMIT 1;`
    );

    const res = z.array(
      z.object({
        result: z.array(
          z.object({ id: z.string(), draw_datetime: z.coerce.date() })
        ),
      })
    );

    const p = res.parse(draw);
    const output = p.at(0)?.result.at(0);

    return output;
  }),
});
