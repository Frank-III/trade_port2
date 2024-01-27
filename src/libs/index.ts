import { db } from "./db";
import { eq } from "drizzle-orm";
import { trending } from "./db/schema";

// await migrate(db, { migrationsFolder: "drizzle" });

// await sqlite.close();

//test trending query ---> PASS
// const trendingRows = await db.query.trending.findMany({
//   where: eq(trending.kind, "solana"),
//   with: {
//     collections: true,
//   },
//   limit: 20,
//   offset: 0,
// });

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
// const collectionPropertiesRows = await db.query.collections.findMany({
//   where: (collections, { eq }) => eq(collections.name, "Lucy"),
//   with: {
//     attributes: {
//       with: {
//         kinds: true,
//       },
//     },
//   },

//   limit: 20,
//   offset: 0,
// });

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
// console.log(collectionItemRows[0]["itemAttributes"]);
