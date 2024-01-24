import { z } from "zod";
import { procedure, router } from "../utils";
import {
	collectionItems,
	collectionWithProperties,
	fakeMintingData,
	fakeTrendingData,
} from "~/libs/fake_data";
import { min } from "drizzle-orm";

const queryOneCollectionInput = z.object({
	kind: z.enum(["solana", "ethereum", "all"]),
	name: z.string(),
});

const infiniteQueryInput = z.object({
	kind: z.enum(["solana", "ethereum", "all"]).optional().default("all"),
	ts: z.number().optional().default(1),
	cat: z.string().optional().default("vol"),
	limit: z.number().min(10).max(30).default(20),
	cursor: z.number().nullish(),
});

const infiniteItemsInput = z.object({
	collection: z.string(),
	filters: z.record(z.array(z.string())).optional().default({}),
	minPrice: z.number().optional().default(0),
	maxPrice: z.number().optional().default(10000),
	minRarity: z.number().optional().default(1),
	maxRarity: z.number().optional().default(5000),
	listed: z.enum(["listed", "unlisted", "all"]).optional().default("all"),
	marketPlace: z.array(z.string()).optional().default([]),
	limit: z.number().min(10).max(30).default(20),
	cursor: z.number().nullish(),
});

export const nftRouter = router({
	trending: procedure.input(infiniteQueryInput).query(async ({ input }) => {
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
	minting: procedure.input(infiniteQueryInput).query(async ({ input }) => {
		const { kind, limit, cursor } = input;
		const items = (
			kind === "all"
				? fakeMintingData
				: fakeMintingData.filter((item) => item.kind === kind)
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
	// TODO: get the dataset work
	collectionDetail: procedure
		.input(queryOneCollectionInput)
		.query(async ({ input }) => {
			return fakeTrendingData.find(
				(item) => item.collection.name === input.name,
			);
		}),
	collectionProperties: procedure
		.input(queryOneCollectionInput)
		.query(async ({ input }) => {
			return collectionWithProperties.find(
				(item) => item.collectionName === input.name,
			);
		}),

	collectionItems: procedure
		.input(infiniteItemsInput)
		.query(async ({ input }) => {
			const {
				collection,
				filters,
				minPrice,
				maxPrice,
				minRarity,
				maxRarity,
				listed,
				marketPlace,
				limit,
				cursor,
			} = input;

			const filteredItems = collectionItems.filter(
				(item) => item.collectionName === collection,
				//&& item.lastBid > minPrice &&
				// item.lastBid < maxPrice,
			);

			//TODO: figure this out
			const filteredItemsWithFilters = Object.entries(filters)
				.reduce((items, [filter, values]) => {
					if (values.length === 0) return items;
					return items.filter((item) => {
						const val = item.properties.find((p) => p.name === filter)?.value;
						return val !== undefined && values.includes(val);
					});
				}, filteredItems)
				.slice(cursor ?? 0, cursor ? cursor + limit : limit);

			const nextCursor = cursor
				? cursor >= 100 - limit
					? null
					: cursor + limit
				: limit;
			const prevCursor = cursor ? cursor - limit : null;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return {
				filteredItemsWithFilters,
				nextCursor,
				prevCursor,
			};
		}),
});
