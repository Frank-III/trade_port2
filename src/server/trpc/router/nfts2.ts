import { z } from "zod";
import { procedure, router } from "../utils";
import {
  collectionItems,
  collectionWithProperties,
  fakeMintingData,
  fakeTrendingData,
} from "~/libs/fake_data";
import { db } from "~/libs/db";
import { and, count, eq, exists, inArray } from "drizzle-orm";
import {
  trending as trendingTable,
  items as itemsTable,
  itemAttributes as itemAttributesTable,
  attributeKinds as attributeKindsTable,
  collectionAttributes as collectionAttributesTable,
} from "~/libs/db/schema";

const queryOneCollectionInput = z.object({
  kind: z.enum(["solana", "ethereum", "all"]),
  id: z.number(),
});

const infiniteQueryInput = z.object({
  kind: z.enum(["solana", "ethereum", "all"]).optional().default("all"),
  ts: z.number().optional().default(1),
  cat: z.string().optional().default("vol"),
  limit: z.number().min(10).max(30).default(20),
  cursor: z.number().nullish(),
});

const infiniteItemsInput = z.object({
  collection: z.number(),
  filters: z.record(z.array(z.string())).optional().default({}),
  minPrice: z.number().optional().default(0),
  maxPrice: z.number().optional().default(10000),
  minRarity: z.number().optional().default(1),
  maxRarity: z.number().optional().default(5000),
  listed: z.enum(["listed", "unlisted", "all"]).optional().default("all"),
  marketPlace: z.array(z.string()).optional().default([]),
  limit: z.number().min(10).max(30).default(10),
  cursor: z.number().nullish(),
});

export const nftRouter = router({
  trending: procedure.input(infiniteQueryInput).query(async ({ input }) => {
    const { kind, limit, cursor } = input;

    const total = await db
      .select({ value: count() })
      .from(trendingTable)
      .where(kind !== "all" ? eq(trendingTable.kind, kind) : undefined);

    // Should I flatten the data here? should I need orderby
    const items = await db.query.trending.findMany({
      where:
        kind !== "all"
          ? (trending, { eq }) => eq(trending.kind, kind)
          : undefined,
      with: {
        collections: true,
      },
      limit: limit,
      offset: cursor ?? 0,
    });

    const nextCursor = cursor
      ? cursor >= total[0].value - limit
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

  minting: procedure.input(infiniteQueryInput).query(async ({ input }) => {
    const { kind, limit, cursor } = input;

    // Should I flatten the data here? should I need orderby
    const items = await db.query.minting.findMany({
      where:
        kind !== "all"
          ? (minting, { eq }) => eq(minting.kind, kind)
          : undefined,
      with: {
        collections: true,
      },
      limit: limit,
      offset: cursor ?? 0,
    });

    const nextCursor = cursor
      ? cursor >= 5000 - limit
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
  // TODO: get the dataset work
  collectionDetail: procedure
    .input(queryOneCollectionInput)
    .query(async ({ input }) => {
      return fakeTrendingData.find(
        (item) => item.collection.name === input.name,
      );
    }),
  // As it should be fetched when navigate to collection detail page, with param as the id
  collectionProperties: procedure
    .input(queryOneCollectionInput)
    .query(async ({ input }) => {
      const collectionWithProperties = await db.query.collections.findFirst({
        where: (collection, { eq }) => eq(collection.id, input.id),
        with: {
          attributes: {
            with: {
              kinds: true,
            },
          },
        },
      });
      return collectionWithProperties;
    }),

  collectionItems: procedure
    .input(infiniteItemsInput)
    .query(async ({ input }) => {
      const {
        collection,
        filters,
        minPrice,
        maxPrice,
        minRarity, // how to do this
        maxRarity,
        listed,
        marketPlace,
        limit,
        cursor,
      } = input;

      // // not quite right, maybe go back to the old way: SQL query
      // const filteredItems = await db.query.items.findMany({
      //   where: (item, { eq, gte, lte }) =>
      //     and(
      //       eq(item.collection_id, collection),
      //       gte(item.lastSale, minPrice),
      //       lte(item.lastSale, maxPrice),
      //     ),
      //   with: {
      //     itemAttributes: {
      //       with: {
      //         kind: {
      //           with: {
      //             attribute: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      const noEmptyFilter = Object.entries(filters).filter(
        ([_, value]) => value.length > 0,
      );

      // TODO: fix this line, then we should be good to go
      const filteredItems = await db
        .select()
        .from(itemsTable)
        .innerJoin(
          itemAttributesTable,
          eq(itemsTable.id, itemAttributesTable.item_id),
        )
        .innerJoin(
          attributeKindsTable,
          eq(itemAttributesTable.kind_id, attributeKindsTable.id),
        )
        .where(
          and(
            // some other filters
            //
            // should map here
            ...noEmptyFilter.map(([key, value]) =>
              exists(
                db
                  .select()
                  .from(itemAttributesTable)
                  .innerJoin(
                    attributeKindsTable,
                    eq(itemAttributesTable.kind_id, attributeKindsTable.id),
                  )
                  .innerJoin(
                    collectionAttributesTable,
                    eq(
                      attributeKindsTable.attribute_id,
                      collectionAttributesTable.id,
                    ),
                  )
                  .where(
                    and(
                      eq(itemAttributesTable.item_id, itemsTable.id),
                      eq(collectionAttributesTable.name, key),
                      inArray(attributeKindsTable.name, value),
                    ),
                  ),
              ),
            ),
          ),
        );

      const nextCursor = cursor
        ? cursor >= 10 - limit
          ? null
          : cursor + limit
        : limit;
      const prevCursor = cursor ? cursor - limit : null;
      return {
        filteredItems,
        nextCursor,
        prevCursor,
      };
    }),
});
