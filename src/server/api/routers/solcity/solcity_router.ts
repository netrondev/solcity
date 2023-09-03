import { createTRPCRouter } from "../../trpc";
import { drawsRouter } from "./draws";

export const solcity_router = createTRPCRouter({
  draws: drawsRouter,
});
