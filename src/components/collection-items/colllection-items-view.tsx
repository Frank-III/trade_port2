import { Tabs } from "@kobalte/core";
import { For, createSignal, useContext, Suspense } from "solid-js";

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
import { CollectionItemsView } from "./collection-items";

const tabStyle =
  "bg-transparent  hover:(text-base-font-receding-color) [&[data-selected]]:(text-offwhite ) px-[12px] ";

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

export function CollectionItemsTabView() {
  // const { filter, filterSetter } = useContext(StoreContext);
  const [tab, setTab] = createSignal<string>("items");

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
      class="lt-lg:h-[100vh-80px] h-[60vh-78px] "
      value={tab()}
      onChange={setTab}
    >
      <div class="border-b-base-font-more-receding-color border-b-1 border-border flex flex-row justify-between space-y-1 pb-1">
        <Tabs.List class="relative flex flex-row justify-between">
          <div class="text-base-font-more-receding-color inline-flex text-[20px] font-normal">
            <Tabs.Trigger class={tabStyle} value="items">
              Items
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="bids">
              Bids
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="holders">
              Holders
            </Tabs.Trigger>
            <Tabs.Indicator class="tabs-indicator transition-250 bg-primary absolute bottom--1 h-0.5 transition transition-all " />
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
      <Suspense fallback={<div>Loading...</div>}>
        <Tabs.Content class="" value="items">
          <CollectionItemsView />
        </Tabs.Content>
        <Tabs.Content class="" value="bids">
          bids
        </Tabs.Content>
        <Tabs.Content class="" value="holders">
          holders
        </Tabs.Content>
      </Suspense>
    </Tabs.Root>
  );
}
