import { Tabs } from "@kobalte/core";
import { For, createSignal, useContext, Suspense, lazy, Show } from "solid-js";
// import
// 	minPrice,
// 	maxPrice,
// 	status,
// 	filterRarityMin,
// 	filterRarityMax,
// 	marketPlace,
// } from "~/components/collections/signals";
import { GenericSelect2 } from "../generic-select";
import { setViewSort, viewSort, viewStyle, setViewStyle } from "./signals";
import { viewSortOptions } from "./val-maps";
import { Grid2X2, Grid3X3, List } from "lucide-solid";
import { cn } from "~/utils/cn";
import { SetStoreFunction } from "solid-js/store";
// import CollectionItemsView from "./collection-items";
const CollectionItemsView = lazy(() => import("./collection-items"));

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

export default function CollectionItemsTabView(props: {
  filter: Record<string, number[]>;
  collectionId: number;
}) {
  const [tabs, setTabs] = createSignal([
    {
      id: "items",
      title: "Items",
      component: () => (
        <CollectionItemsView
          filter={props.filter}
          collectionId={props.collectionId}
        />
      ),
    },
    { id: "bids", title: "Bids", component: () => <div>Tab body 2</div> },
    { id: "holders", title: "Holders", component: () => <div>Tab body 3</div> },
  ]);

  const [curTab, setCurTab] = createSignal<string>("items");

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
      aria-label="Table Item View"
      class="lt-lg:h-[100vh-80px] h-[calc(60vh-78px)]"
      value={curTab()}
      onChange={setCurTab}
    >
      <div class="border-b-base-font-more-receding-color border-b-1 border-border flex flex-row justify-between space-y-1 pb-1">
        <Tabs.List class="relative flex flex-row justify-between">
          <div class="text-base-font-more-receding-color inline-flex text-[20px] font-normal">
            <For each={tabs()}>
              {(tab) => (
                <Tabs.Trigger value={tab.id} class={tabStyle}>
                  {tab.title}
                </Tabs.Trigger>
              )}
            </For>
            <Tabs.Indicator class="tabs-indicator transition-250 bg-primary absolute bottom--1 h-0.5 transition transition-all " />
          </div>
        </Tabs.List>
        <Show when={curTab() === "items"}>
          <div class="flex flex-row space-x-3">
            <ViewSelector />
            <GenericSelect2<string>
              options={viewSortOptions}
              val={viewSort}
              setVal={setViewSort}
            />
          </div>
        </Show>
      </div>
      <Suspense fallback={<div>loading</div>}>
        <For each={tabs()}>
          {(tab) => (
            <Tabs.Content class="h-[calc(100%-50px)]" value={tab.id}>
              <tab.component />
            </Tabs.Content>
          )}
        </For>
        {/* <Tabs.Content class="h-[calc(100%-50px)]" value="items">
          <CollectionItemsView
            filter={props.filter}
            collectionId={props.collectionId}
          />
        </Tabs.Content>
        <Tabs.Content class="" value="bids">
          bids
        </Tabs.Content>
        <Tabs.Content class="" value="holders">
          holders
        </Tabs.Content> */}
      </Suspense>
    </Tabs.Root>
  );
}