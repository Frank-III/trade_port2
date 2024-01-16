import { createStore } from "solid-js/store";
import { useParams } from "solid-start";
import {
	CollectionDetail,
	CollectionStats,
} from "~/components/collections/collection_detail";
import Nav from "~/components/nav";
import { trpc } from "~/utils/trpc";
import {
	filterSearch,
	setFilterListed,
	setFilterSearch,
	filterListed,
} from "~/components/collections/signals";
import { Filter } from "~/components/collections/filter";

const DetailedPage = () => {
	const params = useParams();

	const collectionDetailQuery = trpc.nftRouter.collectionProperties.useQuery(
		() => ({
			kind: "solana",
			name: params.name,
		}),
	);

	// TODO: figure this out
	const [filter, setFilter] = createStore(
		Object.keys(collectionDetailQuery.data?.allProperties).reduce(
			(acc: Record<string, Array<string>>, key) => {
				acc[key] = [];
				return acc;
			},
			{},
		),
	);

	return (
		<main>
			<Nav />
			<div class="page-container m-auto max-w-[1600px] p-[58px_20px_15px] ">
				<div class="collection-layout gap-10px w-100% flex flex-col ">
					<div class="collection-top gap-10px gap-y-10px flex flex-wrap items-center justify-between">
						<CollectionDetail collectionName="Janiya" />
						<CollectionStats collectionName="Janiya" />
					</div>
					<div class="collection-bottom lt-lg:h-auto flex h-[calc(100vh-164px)] w-full">
						<div class="collection-filter">
							<Filter filterStore={filter} storeSetter={setFilter} />
						</div>
						<div class="collection-items"></div>
						<div class="activities"></div>
					</div>
				</div>
			</div>
		</main>
	);
};
