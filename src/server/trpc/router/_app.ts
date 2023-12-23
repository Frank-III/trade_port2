import { router } from "../utils";
import example from "./example";
import { nftRouter } from "./nfts";

export const appRouter = router({
  example,
  nftRouter,
});

export type IAppRouter = typeof appRouter;
