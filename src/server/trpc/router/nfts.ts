import { z } from "zod";
import { procedure, router } from "../utils";
import { fakeTrendingData } from "~/libs/fake_trending";

export const nftRouter = router({
  trending: procedure
    .input(
      z.object({
        kind: z.enum(["solana", "ethereum", "sui", "all"]).default("all"),
        limit: z.number().min(10).max(30).default(20),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { kind, limit, cursor } = input;
      const items = (
        kind === "all"
          ? fakeTrendingData
          : fakeTrendingData.filter((item) => item.kind === kind)
      ).slice(cursor ?? 0, cursor ? cursor + limit : limit);

      const nextCursor = cursor
        ? cursor >= 5000 - limit
          ? null
          : cursor + limit
        : limit;
      const prevCursor = cursor ? cursor - limit : null;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        items,
        nextCursor,
        prevCursor,
      };
    }),
});
