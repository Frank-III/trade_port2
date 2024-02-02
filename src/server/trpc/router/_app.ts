import { inferRouterOutputs } from "@trpc/server";
import { router } from "../utils";
import example from "./example";
import { nftCollectionsRouter } from "./nftCollections";
import { nftItemsRouter } from "./nftItems";

export const appRouter = router({
	example,
	nftCollectionsRouter,
	nftItemsRouter,
});

export type IAppRouter = typeof appRouter;

export type AppRouterOutput = inferRouterOutputs<typeof appRouter>;

export type CollectionWithProperties =
	AppRouterOutput["nftCollectionsRouter"]["collectionProperties"];

export type CollectionItemWithProperties =
	AppRouterOutput["nftCollectionsRouter"]["collectionItems"]["items"][number];
