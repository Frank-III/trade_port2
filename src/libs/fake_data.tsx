import { faker } from "@faker-js/faker";
import { fstat } from "fs";
import type {
	TrendingTableRow,
	Collection,
	MintingTableRow,
} from "~/components/table/types";
import { db } from "./index";

function createCollection() {
	return {
		name: faker.person.firstName(),
		avatar: faker.image.avatar(),
		supply: Number(
			faker.finance.amount({ min: 5, max: 10, dec: 3, symbol: "" }),
		),
		verified: faker.datatype.boolean(0.6),
		twitter: faker.internet.url(),
		website: faker.internet.url(),
		// a list of enum values
		properties: faker.helpers.arrayElements(
			[
				"background",
				"ear",
				"eye color",
				"top",
				"eye",
				"outfit",
				"weapon",
				"mouse",
				"name",
				"nose",
				"hat",
			],
			{ min: 4, max: 8 },
		),
	} as Collection;
}

export function createTrendingRow(): TrendingTableRow {
	return {
		collection: createCollection(),
		floor: Number(
			faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
		),
		market_cap: Number(
			faker.finance.amount({ min: 5, max: 100000, dec: 0, symbol: "" }),
		),
		volume: Number(
			faker.finance.amount({ min: 10, max: 500, dec: 1, symbol: "" }),
		),
		volume_usd: Number(
			faker.finance.amount({ min: 10, max: 500, dec: 3, symbol: "" }),
		),
		sales: Number(
			faker.finance.amount({ min: 5, max: 1000, dec: 0, symbol: "" }),
		),
		average: Number(
			faker.finance.amount({ min: 5, max: 10, dec: 1, symbol: "" }),
		),
		kind: faker.helpers.arrayElement(["solana", "ethereum", "sui"]),
	} as TrendingTableRow;
}

// TODO: fix this unknown type
export function createMintingRow(): MintingTableRow {
	return {
		collection: createCollection(),
		launched: faker.date.past(),
		mint_price: Number(
			faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
		),
		floor: Number(
			faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" }),
		),
		mint_vol: Number(
			faker.finance.amount({ min: 10, max: 500, dec: 1, symbol: "" }),
		),
		mint_vol_usd: Number(
			faker.finance.amount({ min: 10, max: 500, dec: 3, symbol: "" }),
		),
		num_mints: Number(
			faker.finance.amount({ min: 5, max: 1000, dec: 0, symbol: "" }),
		),
		kind: faker.helpers.arrayElement(["solana", "ethereum", "sui"]),
	} as unknown as MintingTableRow;
}

export const fakeTrendingData = faker.helpers.multiple(createTrendingRow, {
	count: 5000,
});

export const fakeMintingData = faker.helpers.multiple(createMintingRow, {
	count: 5000,
});

// create fake collection properties:
export const collectionWithProperties = fakeTrendingData.map((row) => {
	const collection = row.collection;

	const genOneProperty = () =>
		[faker.lorem.word(), faker.number.int({ max: 100 })] as const;
	const collectionProperties = collection.properties.reduce(
		(acc: Record<string, Record<string, number>>, prop: string) => {
			// call genOneProperty() n times
			const pps = Array(20)
				.fill(0)
				.map(genOneProperty)
				.reduce((pp: Record<string, number>, [key, value]) => {
					pp[key] = value;
					return pp;
				}, {});
			acc[prop] = pps;
			return acc;
		},
		{},
	);
	return {
		collectionName: collection.name,
		allProperties: collectionProperties,
	};
});

export type CollectionWithProperties = (typeof collectionWithProperties)[0];

export const collectionItems = collectionWithProperties.flatMap((row) => {
	return faker.helpers.multiple(
		() => {
			return {
				collectionName: row.collectionName,
				name: faker.person.middleName(),
				image: faker.image.avatar(),
				lastBid: faker.number.float({ min: 0, max: 1000, precision: 2 }),
				lastSale: faker.number.float({ min: 0, max: 1000, precision: 2 }),
				tokenId: faker.string.uuid(),
				properties: Object.entries(row.allProperties).map(([key, value]) => {
					return {
						name: key,
						value: faker.helpers.arrayElement(Object.keys(value)),
					};
				}),
			};
		},
		{ count: 100 },
	);
});

// console.log(collectionItems[0]);
//TODO: create drizzle schemas and store into sqlite db
