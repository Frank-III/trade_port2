import { z } from "zod";
import { procedure, router } from "../utils";
import { fakeMintingData, fakeTrendingData } from "~/libs/fake_trending";

export const nftRouter = router({
	trending: procedure
		.input(
			z.object({
				kind: z.enum(["solana", "ethereum", "all"]).optional().default("all"),
				ts: z.number().optional().default(1),
				cat: z.string().optional().default("vol"),
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
	minting: procedure
		.input(
			z.object({
				kind: z.enum(["solana", "ethereum", "all"]).optional().default("all"),
				ts: z.number().optional().default(1),
				cat: z.string().optional().default("vol"),
				limit: z.number().min(10).max(30).default(20),
				cursor: z.number().nullish(),
			}),
		)
		.query(async ({ input }) => {
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
	collectionDetail: procedure
		.input(
			z.object({
				kind: z.enum(["solana", "ethereum", "all"]).optional().default("all"),
				name: z.string(),
			}),
		)
		.query(async ({ input }) => {
			return fakeTrendingData.find(
				(item) => item.collection.name === input.name,
			);
		}),
});
