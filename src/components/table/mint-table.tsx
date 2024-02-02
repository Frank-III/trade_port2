import { type MintingTableRow } from "./types";
import {
	createSignal,
	For,
	createEffect,
	onCleanup,
	Show,
	Suspense,
	Match,
	Switch,
	onMount,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import { Image } from "@kobalte/core";
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
import { currency, catVal, tsVal } from "./signals";

export default function MintTable() {
	const query = trpc.nftCollectionsRouter.minting.useInfiniteQuery(
		() => ({
			kind: currency(),
			ts: tsVal(),
			cat: catVal(),
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
	onMount(() => {
		window.addEventListener("scroll", handleScroll);
	});

	onCleanup(() => {
		window.removeEventListener("scroll", handleScroll);
	});
	//TODO: onMount would set the default data (but maybe do it with suspense?)

	return (
		<Table class="mx-auto mb-0">
			<TableHeader class="z-3 bg-background sticky top-[57px]">
				<TableRow ref={tableHeaderRef}>
					<TableHead class="w-[100px]">COLLECTION</TableHead>
					<TableHead>LAUNCHED</TableHead>
					<TableHead>MINT PRICE</TableHead>
					<TableHead>FLOOR</TableHead>
					<TableHead>MINT VOL</TableHead>
					<TableHead>MINT VOL USD</TableHead>
					<TableHead class="text-right">NUM MINTS</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<Suspense fallback={<TableRowSkeleton limits={20} />}>
					<Switch>
						<Match when={query.data}>
							<For each={query.data?.pages}>
								{(page) => (
									<For each={page.items}>
										{(item: MintingTableRow, idx) => (
											<TableRow id={idx.toString()} class="">
												<TableCell class="w-[100px]">
													<div class="flex flex-row items-center space-x-3">
														<Image.Root
															fallbackDelay={300}
															class="h-[40px] w-[40px] "
														>
															<Image.Img
																class="rounded-full object-fill"
																src={item.collection.avatar}
																alt="nft collection avatar"
															/>
															<Image.Fallback>
																{item.collection.name.slice(0, 1)}
															</Image.Fallback>
														</Image.Root>
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
														{item.launched.toString()} SOL
													</div>
												</TableCell>
												<TableCell>
													<div class="text-table">{item.mint_price} SOL</div>
												</TableCell>
												<TableCell class="text-right">
													<div class="text-table">{item.floor} NFTs</div>
												</TableCell>
												<TableCell class="text-right">
													<div class="text-table">{item.mint_vol} NFTs</div>
												</TableCell>
												<TableCell class="text-right">
													<div class="text-table">{item.mint_vol_usd} NFTs</div>
												</TableCell>
												<TableCell class="text-right">
													<div class="text-table">{item.num_mints} NFTs</div>
												</TableCell>
											</TableRow>
										)}
									</For>
								)}
							</For>
							<Show when={query.isFetchingNextPage}>
								<TableRowSkeleton limits={20} />
							</Show>
						</Match>
					</Switch>
				</Suspense>
			</TableBody>
		</Table>
	);
}
