import {
	CollectionDetail,
	CollectionStats,
} from "~/components/collections/collection-detail";
// const Filter = lazy(() => import("~/components/collections/filter"));
import Filter from "~/components/collections/filter";
import Nav from "~/components/nav";
import { trpc } from "~/utils/trpc";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { CollectionItemsTabView } from "~/components/collection-items/colllection-items-view";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { createContext, createEffect, lazy, Show, Suspense } from "solid-js";
import { useParams } from "solid-start";

type StoreContext = {
	filter: Record<number, Array<number>>;
	filterSetter: SetStoreFunction<Record<number, Array<number>>>;
};

export const StoreContext = createContext<StoreContext>({
	filter: {},
	filterSetter: () => {},
});

const DetailPage = () => {
	const params = useParams<{
		kind: "all" | "solana" | "ethereum";
		id: string;
	}>();

	const collectionDetailQuery = trpc.nftRouter2.collectionProperties.useQuery(
		() => ({
			kind: params.kind, // could be removed
			// kind: "all",
			// id: 1,
			id: Number(params.id),
		}),
	);

	// wait for the query to be ready to create the store: how
	// const [filter, setFilter] = createStore(
	// 	collectionDetailQuery.data?.attributes.reduce(
	// 		(acc: Record<string, Array<number>>, val) => {
	// 			acc[val.id] = [];
	// 			return acc;
	// 		},
	// 		{},
	// 	),
	// );

	const [filter, setFilter] = createStore({});

	createEffect(() => {
		if (collectionDetailQuery.isSuccess) {
			const newFilter = collectionDetailQuery.data.attributes.reduce(
				(acc: Record<string, Array<number>>, val) => {
					acc[val.id] = [];
					return acc;
				},
				{},
			);
			setFilter(newFilter);
			console.log(filter);
		}
	});

	return (
		<main>
			<Nav />
			<Show
				when={collectionDetailQuery.data && Object.keys(filter).length > 0}
				fallback={<div>loading</div>}
			>
				<div class="page-container m-auto max-w-[1600px] p-[58px_20px_15px] ">
					<div class="collection-layout gap-10px w-100% flex flex-col ">
						<div class="collection-top gap-10px gap-y-10px flex flex-wrap items-center justify-between">
							<CollectionDetail collection={collectionDetailQuery.data} />
							<CollectionStats collection={collectionDetailQuery.data} />
						</div>
						<Suspense fallback={<div>Loading...</div>}>
							<StoreContext.Provider
								value={{ filter, filterSetter: setFilter }}
							>
								<div class="collection-bottom lt-lg:h-auto flex h-[calc(100vh-180px)] w-full overflow-auto">
									<div class="collection-filter">
										<div class="flex flex-row">
											<Show when={collectionDetailQuery.data}>
												<Filter collection={collectionDetailQuery.data} />
											</Show>
											<div class="border-1 border-border flex items-center justify-center border hover:bg-[#271C10]">
												<ChevronLeft />
											</div>
										</div>
									</div>
									<div class="collection-items-and-chart flex flex-grow flex-col ">
										<div class="collection-items border-border border-t">
											<CollectionItemsTabView />
										</div>
									</div>
									<div class="activities w-330px border-border lt-lg:hidden overflow-hidden border-y">
										<div class="collapse-right border-border w-20px flex h-full items-center justify-center border-r">
											<ChevronRight />
										</div>
										<div class="activities flex w-full flex-col ">
											<div class="activities-header"></div>
										</div>
									</div>
								</div>
							</StoreContext.Provider>
						</Suspense>
					</div>
				</div>
			</Show>
		</main>
	);
};

export default DetailPage;
