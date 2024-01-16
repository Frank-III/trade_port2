import { createStore } from "solid-js/store";
import { useParams } from "solid-start";
import {
	CollectionDetail,
	CollectionStats,
} from "~/components/collections/collection_detail";
import { Filter } from "~/components/collections/filter";
import Nav from "~/components/nav";
import { trpc } from "~/utils/trpc";

const name = "Jany";

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
	return (
		<main>
			<Nav />
			<div class="page-container p-[58px_20px_15px] max-w-[1600px] m-auto ">
				<div class="collection-layout flex flex-col gap-10px w-100% ">
					<div class="collection-top flex flex-wrap gap-10px gap-y-10px items-center justify-between">
						<CollectionDetail collectionName={name} />
						<CollectionStats collectionName={name} />
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

export default Next;
