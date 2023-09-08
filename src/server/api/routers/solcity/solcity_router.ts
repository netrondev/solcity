import { createTRPCRouter } from "../../trpc";
import { drawsRouter } from "./draws";
import { usersRouter } from "./users";

export const solcity_router = createTRPCRouter({
  draws: drawsRouter,
  users: usersRouter,
});
