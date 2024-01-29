import { inferRouterOutputs } from "@trpc/server";
import { router } from "../utils";
import example from "./example";
import { nftRouter } from "./nfts";
import { nftRouter2 } from "./nfts2";

export const appRouter = router({
  example,
  // nftRouter,
  nftRouter2,
});

export type IAppRouter = typeof appRouter;

export type AppRouterOutput = inferRouterOutputs<typeof appRouter>;

export type CollectionWithProperties =
  AppRouterOutput["nftRouter2"]["collectionProperties"];

export type CollectionItemWithProperties =
  AppRouterOutput["nftRouter2"]["collectionItems"]["items"][number];
