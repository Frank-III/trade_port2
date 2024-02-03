import { z } from "zod";
import { procedure, router } from "../utils";
import { db } from "~/libs/db";
import { and, count, eq, exists, inArray, sql } from "drizzle-orm";
// import {
// 	collections as collectionsTable,
// 	trending as trendingTable,
// 	items as itemsTable,
// 	itemAttributes as itemAttributesTable,
// 	attributeKinds as attributeKindsTable,
// 	collectionAttributes as collectionAttributesTable,
// 	itemActivities,
// } from "~/libs/db/schema";
const infiniteActivities = z.object({
  itemIdx: z.array(z.number()).optional(),
  activityKind: z
    .enum([
      "sales",
      "listing",
      "accept_bids",
      "bids",
      "transfer",
      "mints",
      "stakes",
      "all",
    ])
    .optional()
    .default("all"),
  time: z.string().optional().default("all"),
  withOutlier: z.boolean().optional().default(true),
  limit: z.number().min(10).max(30).default(10),
  cursor: z.number().nullish(),
});

export const nftItemsRouter = router({
  itemActivities: procedure
    .input(infiniteActivities)
    .query(async ({ input }) => {
      const { itemIdx, limit, cursor, activityKind } = input;

      const items = await db.query.itemActivities.findMany({
        where: (itemActivities, { inArray, eq }) =>
          and(
            itemIdx ? inArray(itemActivities.item_id, itemIdx) : undefined,
            activityKind !== "all"
              ? eq(itemActivities.type, activityKind)
              : undefined,
          ),
        with: {
          item: true,
        },
        limit: limit,
        offset: cursor ?? 0,
      });
      const nextCursor = cursor
        ? cursor >= 10 - limit
          ? null
          : cursor + limit
        : limit;
      const prevCursor = cursor ? cursor - limit : null;

      return {
        items,
        nextCursor,
        prevCursor,
      };
    }),
  itemDetails: procedure
    .input(
      z.object({
        id: z.number(),
        activityKind: z
          .enum([
            "sales",
            "listing",
            "accept_bids",
            "bids",
            "transfer",
            "mints",
            "stakes",
            "all",
          ])
          .optional()
          .default("all"),
      }),
    )
    .query(async ({ input }) => {
      const item = await db.query.items.findFirst({
        where: (items, { eq }) => eq(items.id, input.id),
        with: {
          collection: true,
          itemAttributes: {
            with: {
              kind: {
                with: {
                  attribute: true,
                },
              },
            },
          },
          activities: {
            where: (itemActivities, { eq }) =>
              input.activityKind !== "all"
                ? eq(itemActivities.type, input.activityKind)
                : undefined,
          },
        },
      });
      return item;
    }),
});
