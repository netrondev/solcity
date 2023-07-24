import { z } from "zod";

export const entrySchema = z.object({
    id: z.string(),
    timestamp: z.date(),
    amount: z.number(),
    user: z.string()
  })


  export type Entry = z.infer<typeof entrySchema>;