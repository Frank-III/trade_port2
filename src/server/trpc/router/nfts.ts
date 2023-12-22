import { z } from "zod";
import { procedure, router } from "../utils";
import { fakeTrendingData } from "~/libs/fake_trending";

export const nftRouter = router({
  trending: procedure.input(z.object({
    kind: z.enum(["solana", "ethereum", "sui", "all"]),
    limit: z.number().min(10).max(30).default(20),
    cursor: z.number().optional()
  })).query(async ({ input, ctx }) => {
    const { kind, limit, cursor } = input;
    const items = fakeTrendingData.slice(cursor ?? 0, cursor ? cursor + limit : limit)


    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.myCursor;
    }

    return {
      items,
      nextCursor: nextCursor + limit
    }
  }),
});
