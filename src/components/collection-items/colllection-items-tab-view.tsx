import { Tabs } from "@kobalte/core";
import {
  For,
  createSignal,
  createMemo,
  Suspense,
  lazy,
  Show,
  createEffect,
} from "solid-js";
// import
// 	minPrice,
// 	maxPrice,
// 	status,
// 	filterRarityMin,
// 	filterRarityMax,
// 	marketPlace,
// } from "~/components/collections/signals";
import { GenericSelect2 } from "../generic-select";
import { createWindowSize } from "@solid-primitives/resize-observer";
import { setViewSort, viewSort, viewStyle, setViewStyle } from "./signals";
import { leftDrawerOpen, setLeftDrawerOpen } from "~/components/global-signals";
import { viewSortOptions } from "./val-maps";
import { Grid2X2, Grid3X3, List } from "lucide-solid";
import CollectionItemsView from "./collection-items";
// const CollectionItemsView = lazy(() => import("./collection-items"));

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
            class="button-default border-none"
            classList={{
              "text-primary": viewStyle() === key,
            }}
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
  const windowsSize = createWindowSize();
  const shouldAddTab = createMemo(() => windowsSize.width <= 1000);

  createEffect(() => {
    if (shouldAddTab()) {
      setTabs((prev) => [
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
        {
          id: "activities",
          title: "Activities",
          component: () => <div>Activities</div>,
        },
        {
          id: "trades",
          title: "Trades",
          component: () => <div>Trades</div>,
        },
        {
          id: "holders",
          title: "Holders",
          component: () => <div>Holders</div>,
        },
      ]);
    } else {
      setTabs([
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
        {
          id: "holders",
          title: "Holders",
          component: () => <div>Tab body 3</div>,
        },
      ]);
    }
  });

  return (
    <Tabs.Root
      aria-label="Table Item View"
      class="lt-lg:h-[calc(100vh-250px)] h-[calc(60vh-78px)] "
      value={curTab()}
      onChange={setCurTab}
      defaultValue={tabs()[0].id}
    >
      <div class="border-b-1 border-border px-5px lt-smm:overflow-x-scroll flex flex-row justify-between space-y-1 pb-1">
        <Tabs.List class="relative flex flex-row justify-between ">
          <div class="text-base-font-more-receding-color inline-flex text-[20px] font-normal">
            <button
              type="button"
              class="lgg:hidden bg-transparent p-1"
              onClick={() => {
                setLeftDrawerOpen(!leftDrawerOpen());
              }}
            >
              <div class="i-mdi-filter-outline text-primary text-22px items-center " />
            </button>
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
          <div class="lt-sm:hidden flex flex-row space-x-3">
            <ViewSelector />
            <GenericSelect2<string>
              options={viewSortOptions}
              val={viewSort}
              setVal={setViewSort}
            />
          </div>
        </Show>
      </div>
      <div class="lt-sm:flex border-border hidden w-full flex-row justify-end border-b py-1">
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
      {/* TODO: should I need to remove this Suspense */}
      {/* <Suspense fallback={<div>loading tab components</div>}> */}
      <For each={tabs()}>
        {(tab) => (
          <Tabs.Content class="h-[calc(100%-50px)]" value={tab.id}>
            {tab.component()}
          </Tabs.Content>
        )}
      </For>
      {/* </Suspense> */}
    </Tabs.Root>
  );
}
