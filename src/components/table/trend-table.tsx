import { TableProps, TrendingTableRow } from "./types";
import {
	createSignal,
	For,
	createEffect,
	onMount,
	onCleanup,
	Show,
	Suspense,
	Match,
	Switch,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import {
	Table,
	TableBody,
	// TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/generic-table/table-style";
import { TableRowSkeleton } from "./table-skeleton";

export default function TrendTable(props: TableProps) {
	const query = trpc.nftRouter.trending.useInfiniteQuery(
		() => ({
			limit: 20,
			cursor: null,
		}),
		() => ({
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: () => 0,
			getPreviousPageParam: (firstPage) => firstPage.prevCursor,
		}),
	);
	const [lastScrollY, setLastScrollY] = createSignal(window.scrollY);
	let tableHeaderRef: HTMLTableRowElement | undefined;
	const handleScroll = () => {
		// logic here: if scroll down to the bottom, fetch next page, if scroll up to the table header(as we would make header stick at top), fetch prev page
		const currentScrollY = window.scrollY;
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			// fetchNext();
			console.log("fetch next");
			query.fetchNextPage();
		} else {
			if (currentScrollY < lastScrollY()) {
				const rect = tableHeaderRef?.getBoundingClientRect();
				if (rect && rect.top < 0) {
					console.log("fetch prev");
					query.fetchPreviousPage();
				}
			}
		}
		setLastScrollY(window.scrollY);
	};
	createEffect(() => {
		window.addEventListener("scroll", handleScroll);
	});

	//TODO: onMount would set the default data (but maybe do it with suspense?)

	onCleanup(() => {
		window.removeEventListener("scroll", handleScroll);
	});

	return (
		<Table class="mx-auto mb-0 overflow-visible">
			<TableHeader class="sticky z-2 sticky z-2 top-0">
				<TableRow ref={tableHeaderRef} >
					<TableHead class="w-[100px]">COLLECTION</TableHead>
					<TableHead>FLOOR</TableHead>
					<TableHead>MARKET CAP</TableHead>
					<TableHead>VOLUME</TableHead>
					<TableHead >VOLUME USD</TableHead>
					<TableHead >SALES</TableHead>
					<TableHead class="text-right">AVERAGE</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<Suspense fallback={<TableRowSkeleton limits={20}/>}>
					<Switch>
						<Match when={query.isSuccess}>
							<For each={query.data?.pages}>
								{(page) => (
								<For each={page.items}>
								{(item, idx) => (
									<TableRow id={idx.toString()} class="">
										<TableCell class="w-[100px]">
											<div class="flex flex-row items-center space-x-3">
												<img
													class="h-[40px] w-[40px] rounded-full"
													src={item.collection.avatar}
													alt="nft collection avatar"
												/>
												<div class="flex flex-col">
													<div class="text-table">
														{item.collection.name}
													</div>
													<div class="text-table">
														{item.collection.supply}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div class="text-table">
												{item.floor} SOL
											</div>
										</TableCell>
										<TableCell>
											<div class="text-table">
												{item.market_cap} SOL
											</div>
										</TableCell>
										<TableCell class="text-right">
											<div class="text-table">
												{item.volume} NFTs
											</div>
										</TableCell>
										<TableCell class="text-right">
											<div class="text-table">
												{item.volume_usd} NFTs
											</div>
										</TableCell>
										<TableCell class="text-right">
											<div class="text-table">
												{item.sales} NFTs
											</div>
										</TableCell>
										<TableCell class="text-right">
											<div class="text-table">
												{item.average} NFTs
											</div>
										</TableCell>
									</TableRow>
								)}
								</For>
								)}
							</For>
						</Match>
					</Switch>
				</Suspense>
			</TableBody>
		</Table>
	);
}
