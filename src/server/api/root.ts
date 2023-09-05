import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { solcity_router } from "./routers/solcity/solcity_router";
import { authSurrealRouter } from "./routers/auth";
import { solana_router } from "./routers/solana/solana_router";
import { surrealdb_router } from "./routers/surrealdb/surrealdb_router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  solcity: solcity_router,
  auth: authSurrealRouter,
  solana: solana_router,
  surrealdb: surrealdb_router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
