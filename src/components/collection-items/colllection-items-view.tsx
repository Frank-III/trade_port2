import { Tabs } from "@kobalte/core";
import { For, createSignal, useContext } from "solid-js";

import { trpc } from "~/utils/trpc";
import {
	minPrice,
	maxPrice,
	status,
	filterRarityMin,
	filterRarityMax,
	marketPlace,
} from "~/components/collections/signals";
import GenericSelect from "../generic-select";
import { setViewSort, viewSort, viewStyle, setViewStyle } from "./signals";
import { viewSortLabelMap, viewSortMap } from "./val-maps";
import { Grid2X2, Grid3X3, List } from "lucide-solid";
import { cn } from "~/utils/cn";
import { StoreContext } from "~/routes/next";

const tabStyle =
	"bg-transparent  hover:(text-base-font-receding-color) [&[data-selected]]:(text-offwhite ) px-[12px] ";

const name = "April";

function ViewSelector() {
	return (
		<div class="inline-flex ">
			<For
				each={
					[
						["list", <List />],
						["grid_sm", <Grid3X3 />],
						["grid_lg", <Grid2X2 />],
					] as const
				}
			>
				{([key, icon]) => (
					<button
						type="button"
						class={cn(
							"button-default border-none",
							viewStyle() === key && "text-primary",
						)}
						onClick={() => {
							setViewStyle(key);
						}}
					>
						{icon}
					</button>
				)}
			</For>
		</div>
	);
}

export function CollectionItemsView(props: {}) {
	const { filter, filterSetter } = useContext(StoreContext);
	const [tab, setTab] = createSignal<string>();

	// const collectionItemsQuery = trpc.nftRouter.collectionItems.useInfiniteQuery(
	// 	() => ({
	// 		collection: name,
	// 		filters: filter,
	// 		minPrice: minPrice(),
	// 		maxPrice: maxPrice(),
	// 		minRarity: filterRarityMin(),
	// 		maxRarity: filterRarityMax(),
	// 		listed: status(),
	// 		marketPlace: marketPlace(),
	// 	}),
	// 	() => ({
	// 		getNextPageParam: (lastPage) => lastPage.nextCursor,
	// 		initialPageParam: () => 0,
	// 		getPreviousPageParam: (firstPage) => firstPage.prevCursor,
	// 	}),
	// );

	return (
		<Tabs.Root
			aria-label="Table Nav"
			class="h-[60vh-78px] lt-lg:h-[100vh-80px] "
			value={tab()}
			onChange={setTab}
		>
			<div class="flex flex-row space-y-1 pb-1 border-b-base-font-more-receding-color border-b-1 justify-between border-border">
				<Tabs.List class="flex flex-row relative justify-between">
					<div class="text-base-font-more-receding-color inline-flex font-normal text-[20px]">
						<Tabs.Trigger class={tabStyle} value="items">
							Items
						</Tabs.Trigger>
						<Tabs.Trigger class={tabStyle} value="bids">
							Bids
						</Tabs.Trigger>
						<Tabs.Trigger class={tabStyle} value="holders">
							Holders
						</Tabs.Trigger>
						<Tabs.Indicator class="tabs-indicator absolute transition transition-all transition-250 bg-primary bottom--1 h-0.5 " />
					</div>
				</Tabs.List>
				<div class="flex flex-row space-x-3">
					<ViewSelector />
					<GenericSelect<string>
						val={viewSort}
						valMap={viewSortMap}
						setVal={setViewSort}
						labelIcon={
							viewSortLabelMap[viewSort() as keyof typeof viewSortLabelMap]
						}
						labelIcons={viewSortLabelMap}
					/>
				</div>
			</div>
			<Tabs.Content class="" value="items">
				items
			</Tabs.Content>
			<Tabs.Content class="" value="bids">
				bids
			</Tabs.Content>
			<Tabs.Content class="" value="holders">
				holders
			</Tabs.Content>
		</Tabs.Root>
	);
}
