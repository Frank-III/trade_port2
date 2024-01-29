import { count, eq, sql, and, exists, inArray } from "drizzle-orm";
import { db } from "./db";
import {
  attributeKinds,
  collectionAttributes,
  collections,
  itemAttributes,
  items,
  trending,
} from "./db/schema";

// await migrate(db, { migrationsFolder: "drizzle" });

// await sqlite.close();

//test trending query ---> PASS
// const trendingRows = await db.query.trending.findMany({
//   where: eq(trending.kind, "solana"),
//   with: {
//     collection: true,
//   },
//   limit: 20,
//   offset: 0,
// });
// console.log(trendingRows);
// // test minting query ---> PASS
// const mintingRows = await db.query.minting.findMany({
//   where: eq(trending.kind, "solana"),
//   with: {
//     collections: true,
//   },
//   limit: 20,
//   offset: 0,
// });

// // test collection with properties query ---> PASS
// const collectionPropertiesRows = await db.query.collections.findFirst({
//   where: (collections, { eq }) => eq(collections.id, 1),
//   with: {
//     attributes: {
//       with: {
//         kinds: true,
//       },
//     },
//   },
// });

// console.log(collectionPropertiesRows);

// // collectionItem query ---> PASS
// const collectionItemRows = await db.query.items.findMany({
//   where: (items, { eq }) => eq(items.collection_id, 1),
//   with: {
//     collection: true,
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
//   limit: 20,
//   offset: 0,
// });
//
// const itemWithKinds = await db
//   .select()
//   .from(items)
//   .leftJoin(itemAttributes, eq(items.id, itemAttributes.item_id))
//   .leftJoin(attributeKinds, eq(itemAttributes.id, attributeKinds.attribute_id))
//   .limit(10);

// const collectionAttributesCount = await db
//   .select({ value: count() })
//   .from(collections)
//   .where(eq(collections.id, 1))
//   .leftJoin(
//     collectionAttributes,
//     eq(collections.id, collectionAttributes.collection_id),
//   );

// console.log(collectionAttributesCount);

async function getFilterItems(props: {
  col_id: number;
  filter: Record<number, Array<number>>;
}) {
  const x =
    Object.entries(props.filter).length > 0
      ? Object.entries(props.filter).map(([key, value]) =>
          exists(
            db
              .select()
              .from(itemAttributes)
              .innerJoin(
                attributeKinds,
                eq(itemAttributes.kind_id, attributeKinds.id),
              )
              .innerJoin(
                collectionAttributes,
                eq(attributeKinds.attribute_id, collectionAttributes.id),
              )
              .where(
                and(
                  eq(itemAttributes.item_id, items.id),
                  eq(collectionAttributes.id, Number(key)),
                  inArray(attributeKinds.id, value),
                ),
              ),
          ),
        )
      : [undefined];
  return await db
    .select({
      id: items.id,
      name: items.name,
      image: items.image,
      collectionId: items.collection_id,
      price: items.price,
      rarity: items.rarity,
      topBid: items.topBid,
      lastAction: items.lastAction,
      tokenId: items.tokenId,
      attributes: sql<string[]>`group_concat(${collectionAttributes.name})`,
      kinds: sql<string[]>`group_concat(${attributeKinds.name})`,
    })
    .from(items)
    .innerJoin(itemAttributes, eq(items.id, itemAttributes.item_id))
    .innerJoin(attributeKinds, eq(itemAttributes.kind_id, attributeKinds.id))
    .innerJoin(
      collectionAttributes,
      eq(attributeKinds.attribute_id, collectionAttributes.id),
    )
    .where(
      and(
        // some other filters
        eq(items.collection_id, props.col_id),
        // should map here
        ...x,
      ),
    )
    .groupBy(items.id);
}

// console.log(
//   (
//     await getFilterItems({
//       col_id: 1,
//       filter: {},
//       // filter: {
//       //   1: [1, 2, 3],
//       //   2: [10, 20, 30],
//       // },
//     })
//   ).length,
// );
