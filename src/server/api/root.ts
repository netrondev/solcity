import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { solcityMainRouter } from "./routers/solcity/solcityMainRouter";
import { authSurrealRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  solcity: solcityMainRouter,
  auth: authSurrealRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
