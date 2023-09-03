import { createTRPCRouter } from "../../trpc";
import { solana_wallet_router } from "./wallet";

export const solana_router = createTRPCRouter({
  wallet: solana_wallet_router,
});
