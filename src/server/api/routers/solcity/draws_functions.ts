import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDB } from "~/server/db";

export async function get_draws() {
  const db = await getDB();

  const draws = await db.query<
    [{ publicKey: string; draws: { draw_datetime: Date; id: string } }[]]
  >(
    `SELECT publicKey, draw_id as draws FROM keypairs WHERE draw_id FETCH draws;`
  );

  const output = draws.at(0)?.result;

  if (!output) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  const parsed = z
    .array(
      z
        .object({
          publicKey: z.string(),
          draws: z.object({ draw_datetime: z.coerce.date(), id: z.string() }),
        })
        .strict()
    )
    .parse(output);

  let first_open_found = false;

  const draw_calc = parsed
    .map((i) => {
      return {
        id: i.draws.id,
        draw_datetime: i.draws.draw_datetime,
        publicKey: i.publicKey,
        // ...i,
        // ...i.draws,
        // draws: undefined,
      };
    })
    .map((i) => ({
      ...i,
      is_closed: i.draw_datetime.getTime() < new Date().getTime(),
      is_open: i.draw_datetime.getTime() > new Date().getTime(),
    }))
    .sort((a, b) => (a.draw_datetime > b.draw_datetime ? 1 : -1))
    .map((i) => {
      let is_next = false;

      if (i.is_open && !first_open_found) {
        is_next = true;
        first_open_found = true;
      }

      return {
        ...i,
        is_next,
      };
    })
    .map((i, idx, arr) => {
      let is_last = false;
      const next = arr[idx + 1];
      if (i.is_closed) {
        if ((next && next.is_open) ?? !next) {
          is_last = true;
        }
      }
      return { ...i, is_last };
    });

  return draw_calc;
}
