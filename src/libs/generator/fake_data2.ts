// import { faker } from "@faker-js/faker";
// import { db } from "~/libs/db/index";
// import { chunk } from "lodash";
// import {
//   collections as collectionTable,
//   collectionAttributes as collectionAttributesTable,
//   attributeKinds as attributeKindsTable,
//   items as itemsTable,
//   itemAttributes as itemAttributesTable,
//   trending as trendingTable,
//   minting as mintingTable,
//   itemActivities as itemActivitiesTable,
// } from "~/libs/db/schema.mysql";

// const collectionTotal = 800;

// async function createCollectionAndItems() {
//   const collection = {
//     name: faker.person.firstName(),
//     avatar: faker.image.avatar(),
//     supply: Number(
//       faker.finance.amount({ min: 5, max: 10, dec: 3, symbol: "" }),
//     ),
//     verified: faker.datatype.boolean(0.6),
//     twitter: faker.internet.url(),
//     website: faker.internet.url(),
//   };

//   // Insert Collection
//   const addedCollection = await db
//     .insert(collectionTable)
//     .values(collection)
//     .returning({ collectionId: collectionTable.id });
//   // Create Collection Attributes
//   const properties = faker.helpers.arrayElements(
//     [
//       "background",
//       "ear",
//       "eye color",
//       "top",
//       "eye",
//       "outfit",
//       "weapon",
//       "mouse",
//       "name",
//       "nose",
//       "hat",
//       "car",
//       "house",
//       "pet",
//     ],
//     { min: 3, max: 6 },
//   );

//   // Insert Collection Attributes
//   const attribute_ids = await db
//     .insert(collectionAttributesTable)
//     .values(
//       properties.map((prop) => ({
//         collection_id: addedCollection[0].collectionId,
//         name: prop,
//       })),
//     )
//     .returning({ attributeId: collectionAttributesTable.id });

//   // Create collection attribute kinds
//   const genOneProperty = () =>
//     [faker.lorem.word(), faker.number.int({ max: 100 })] as const;

//   // Promise.all preserve the order of the array
//   const propertiesAndKinds = await Promise.all(
//     properties.map(async (prop, idx) => {
//       const pps = Array(20).fill(0).map(genOneProperty);
//       // Insert collection attribute kinds:
//       // for each property, insert 20 kinds: return the kind_id
//       const kind_ids = await db
//         .insert(attributeKindsTable)
//         .values(
//           pps.map(([key, value]) => ({
//             attribute_id: attribute_ids[idx].attributeId,
//             name: key,
//             value: value,
//           })),
//         )
//         .returning({ kindId: attributeKindsTable.id });
//       return pps
//         .map(([name, _], idx) => [name, kind_ids[idx].kindId] as const)
//         .reduce((acc: Record<string, number>, i) => {
//           acc[i[0]] = i[1];
//           return acc;
//         }, {});
//     }),
//   );

//   // For one collection, insert 100 items:
//   const items = await Promise.all(
//     Array(100)
//       .fill(0)
//       .map(async () => {
//         const item = {
//           collection_id: addedCollection[0].collectionId,
//           name: faker.person.firstName(),
//           image: faker.image.avatar(),
//           tokenId: faker.string.uuid(),
//           rarity: faker.number.int({ min: 1, max: 5000 }),
//           price: Number(
//             faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
//           ),
//           topBid: Number(
//             faker.finance.amount({ min: 50, max: 100, dec: 3, symbol: "" }),
//           ),
//           lastAction: `${faker.number.int({
//             min: 0,
//             max: 10,
//           })} ${faker.helpers.arrayElement(["hours", "minutes", "days"])}`,
//           owner: faker.string.uuid(),
//         };
//         const item_id = await db
//           .insert(itemsTable)
//           .values(item)
//           .returning({ itemId: itemsTable.id });
//         //insert item activities
//         await Promise.all(
//           Array(30)
//             .fill(0)
//             .map(async (_) => {
//               const item_activity = {
//                 item_id: item_id[0].itemId,
//                 price: Number(
//                   faker.finance.amount({
//                     min: 0.1,
//                     max: 100,
//                     dec: 3,
//                     symbol: "",
//                   }),
//                 ),
//                 type: faker.helpers.arrayElement([
//                   "bids",
//                   "sales",
//                   "listing",
//                   "accept_bids",
//                   "transfer",
//                   "mints",
//                   "stakes",
//                 ] as const),
//                 from: faker.string.uuid(),
//                 to: faker.string.uuid(),
//                 time: `${faker.number.int({
//                   min: 0,
//                   max: 30,
//                 })} ${faker.helpers.arrayElement(["hours", "minutes", "days"])}`,
//               };

//               await db.insert(itemActivitiesTable).values(item_activity);
//             }),
//         );

//         // insert item attribute kinds
//         await Promise.all(
//           properties.map(async (prop, idx) => {
//             const kind = faker.helpers.arrayElement(
//               Object.keys(propertiesAndKinds[idx]),
//             );
//             const kind_id = propertiesAndKinds[idx][kind];
//             await db.insert(itemAttributesTable).values({
//               item_id: item_id[0].itemId,
//               kind_id: kind_id,
//             });
//           }),
//         );
//       }),
//   );
//   return addedCollection[0].collectionId;
// }

// // make sure not memory issue
// const collectionIdx: Array<number> = [];
// for (const arr_chunk of chunk(Array(collectionTotal).fill(""), 20)) {
//   const chunk_idx = await Promise.all(arr_chunk.map(createCollectionAndItems));
//   collectionIdx.push(...chunk_idx);
// }

// // const collectionIdx = await Promise.all(
// //   Array(collectionTotal).fill(0).map(createCollectionAndItems),
// // );
// // const collectionIdx = Array.from({ length: collectionTotal }, (x, i) => i + 1);
// const trendings = collectionIdx.map((id) => {
//   return {
//     collection_id: id,
//     floor: Number(
//       faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
//     ),
//     market_cap: Number(
//       faker.finance.amount({ min: 5, max: 100000, dec: 0, symbol: "" }),
//     ),
//     volume: Number(
//       faker.finance.amount({ min: 10, max: 500, dec: 1, symbol: "" }),
//     ),
//     volume_usd: Number(
//       faker.finance.amount({ min: 10, max: 500, dec: 3, symbol: "" }),
//     ),
//     sales: Number(
//       faker.finance.amount({ min: 5, max: 1000, dec: 0, symbol: "" }),
//     ),
//     average: Number(
//       faker.finance.amount({ min: 5, max: 10, dec: 1, symbol: "" }),
//     ),
//     kind: faker.helpers.arrayElement(["solana", "ethereum", "sui"] as const),
//   };
// });

// await db.insert(trendingTable).values(trendings);

// const minting = collectionIdx.map((id) => ({
//   collection_id: id,
//   launched: faker.date.past(),
//   mint_price: Number(
//     faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
//   ),
//   floor: Number(
//     faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
//   ),
//   mint_vol: Number(
//     faker.finance.amount({ min: 10, max: 500, dec: 1, symbol: "" }),
//   ),
//   mint_vol_usd: Number(
//     faker.finance.amount({ min: 10, max: 500, dec: 3, symbol: "" }),
//   ),
//   num_mints: Number(
//     faker.finance.amount({ min: 5, max: 1000, dec: 0, symbol: "" }),
//   ),
//   kind: faker.helpers.arrayElement(["solana", "ethereum", "sui"] as const),
// }));

// await db.insert(mintingTable).values(minting);
