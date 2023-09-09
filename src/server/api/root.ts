import { createTRPCRouter } from "~/server/api/trpc";
import { solcity_router } from "./routers/solcity/solcity_router";
import { solana_router } from "./routers/solana/solana_router";
import { surrealdb_router } from "./routers/surrealdb/surrealdb_router";

export const appRouter = createTRPCRouter({
  solcity: solcity_router,
  solana: solana_router,
  surrealdb: surrealdb_router,
});

export type AppRouter = typeof appRouter;
