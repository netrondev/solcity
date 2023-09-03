import { createTRPCRouter } from "../../trpc";
import { drawsRouter } from "./draws";

export const solcityMainRouter = createTRPCRouter({
  draws: drawsRouter,
});
