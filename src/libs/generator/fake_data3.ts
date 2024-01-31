import { db } from "../db";
import { faker } from "@faker-js/faker";
import {
	collections,
	items,
	collectionAttributes,
	attributeKinds,
} from "../db/schema";
import { eq, sql } from "drizzle-orm";

//generate
async function generateMoreItems(collectionId: number) {
	const newItems = Array(100)
		.fill(0)
		.map(() => ({
			collection_id: collectionId,
			name: faker.person.firstName(),
			image: faker.image.avatar(),
			tokenId: faker.string.uuid(),
			rarity: faker.number.int({ min: 1, max: 5000 }),
			price: Number(
				faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
			),
			topBid: Number(
				faker.finance.amount({ min: 50, max: 100, dec: 3, symbol: "" }),
			),
			lastAction: `${faker.number.int({
				min: 0,
				max: 10,
			})} ${faker.helpers.arrayElement(["hours", "minutes", "days"])}`,
			owner: faker.string.uuid(),
		}));
	const addedItems = await db
		.insert(items)
		.values(newItems)
		.returning({ itemId: items.id });
	// free newItems
	newItems.length = 0;

	const attrKindMap = await db
		.select({
			attr_id: collectionAttributes.id,
			kind_id: sql<string[]>`group_concat(${attributeKinds.id})`,
		})
		.from(collectionAttributes)
		.where(eq(collectionAttributes.collection_id, collectionId))
		.leftJoin(
			attributeKinds,
			eq(collectionAttributes.id, attributeKinds.attribute_id),
		)
		.groupBy(attributeKinds.attribute_id);

	//more items
}

// make sure memory is not exploding
for (let i = 0; i < 500; i++) {
	await generateMoreItems(i);
}
