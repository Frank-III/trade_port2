import { Suspense, createContext, createEffect, on } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { useParams } from "solid-start";
import {
	CollectionDetail,
	CollectionStats,
} from "~/components/collections/collection-detail";
import { Filter } from "~/components/collections/filter";
import Nav from "~/components/nav";
import { trpc } from "~/utils/trpc";
// import {
// 	minPrice,
// 	maxPrice,
// 	status,
// 	filterRarityMin,
// 	filterRarityMax,
// 	marketPlace,
// } from "~/components/collections/signals";
import { ChevronLeft, Store } from "lucide-solid";
import { CollectionItemsView } from "~/components/collection-items/colllection-items-view";

const name = "April";

type StoreContext = {
	filter: Record<string, Array<string>>;
	filterSetter: SetStoreFunction<Record<string, Array<string>>>;
};

export const StoreContext = createContext<StoreContext>({
	filter: {},
	filterSetter: () => {},
});

const Next = () => {
	const collectionDetailQuery = trpc.nftRouter.collectionProperties.useQuery(
		() => ({
			kind: "solana",
			name: name,
		}),
	);

	const [filter, setFilter] = createStore(
		Object.keys(collectionDetailQuery.data?.allProperties).reduce(
			(acc: Record<string, Array<string>>, key) => {
				acc[key] = [];
				return acc;
			},
			{},
		),
	);

	createEffect(() => {
		filter;
		console.log(filter);
	});

	// TODO: should I query this here or in the collectionItems component?
	// const collectionItemsQuery = trpc.nftRouter.collectionItems.useInfiniteQuery(
	//   () => ({
	//     collection: name,
	//     filters: filter,
	//     minPrice: minPrice(),
	//     maxPrice: maxPrice(),
	//     minRarity: filterRarityMin(),
	//     maxRarity: filterRarityMax(),
	//     listed: status(),
	//     marketPlace: marketPlace(),
	//   })
	// );

	return (
		<main>
			<Nav />
			<div class="page-container m-auto max-w-[1600px] p-[58px_20px_15px] ">
				<div class="collection-layout gap-10px w-100% flex flex-col ">
					<div class="collection-top gap-10px gap-y-10px flex flex-wrap items-center justify-between">
						<CollectionDetail collectionName={name} />
						<CollectionStats collectionName={name} />
					</div>
					<StoreContext.Provider value={{ filter, filterSetter: setFilter }}>
						<div class="collection-bottom lt-lg:h-auto flex h-[calc(100vh-180px)] w-full overflow-auto">
							<div class="collection-filter">
								<div class="flex flex-row">
									<Filter collection={collectionDetailQuery.data!} />
									<div class="flex border border-1 items-center justify-center border-border hover:bg-[#271C10]">
										<ChevronLeft />
									</div>
								</div>
							</div>
							<div class="collection-items-and-chart flex flex-grow flex-col ">
								<div class="collection-items border-t border-border"></div>
								<CollectionItemsView />
							</div>
							<div class="activities h-[cal(40vh-87px)] border-y border-border overflow-hidden lt-lg:hidden"></div>
						</div>
					</StoreContext.Provider>
				</div>
			</div>
		</main>
	);
};

export default Next;
