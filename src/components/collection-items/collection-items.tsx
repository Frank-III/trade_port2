import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  createMemo,
  createSignal,
  useContext,
  onMount,
  onCleanup,
} from "solid-js";
import { viewStyle, selectedItems, setSelectedItems } from "./signals";
import { trpc } from "~/utils/trpc";
import {
  minPrice,
  maxPrice,
  status,
  filterRarityMin,
  filterRarityMax,
  marketPlace,
} from "~/components/collections/signals";
import { type CollectionItemWithProperties } from "~/server/trpc/router/_app";
import { StoreContext } from "~/routes/next";
import {
  CollectionItemListHeader,
  ItemsListSkeleton,
  CollectionItemListView,
  IntantSellListView,
} from "./list-view";
import { cn } from "~/utils/cn";
import { Currency } from "~/components/table/filter-valmaps";
import { Slider } from "@kobalte/core";
import { InstantSellGridView } from "./grid-sm-view";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";

const BuyItem = (props: {
  currency: "solana" | "ethereum";
  totalPrice: number;
}) => {
  const noSelected = createMemo(() => selectedItems().length === 0);
  return (
    <div class="flex items-center gap-5">
      <button
        type="button"
        class={cn(
          "button-primary disabled:(opacity-50 cursor-default) flex-row",
        )}
        disabled={noSelected()}
      >
        <span class="text-offwhite text-base font-normal">
          Buy {`${selectedItems.length} `}Items
        </span>
        <Show when={!noSelected()}>
          <div class="button-default h-auto">
            <div class={cn(Currency[props.currency], "text-18px")} />
            <span class="text-offwhite text-base font-normal">
              {props.totalPrice}
            </span>
          </div>
        </Show>
      </button>
      <Show when={!noSelected()}>
        <div class="text-primary text-base font-normal ">Clear</div>
      </Show>
    </div>
  );
};

const Sweeper = (props: { maxSelected: number }) => {
  const [sweep, setSweep] = createSignal<number>(0);
  const setSweepValue = (v: number) => {
    setSweep(v);
    setSelectedItems(Array.from({ length: v }, (v, i) => i + 1));
  };

  return (
    <div class="gap5 w-50% inline-flex items-center">
      <span class="text-base font-normal">Sweep</span>
      <input
        class="button-default h-[30px] w-[50px] text-base font-normal"
        value={sweep()}
        onChange={(e) => {
          setSweepValue(Number(e.currentTarget.value));
        }}
      />
      <Slider.Root
        value={[sweep()]}
        maxValue={props.maxSelected}
        onChange={(v) => {
          setSweepValue(v[0]);
        }}
        class="h-10px relative mb-2 mt-3 flex flex-[0_1_80%] touch-none select-none flex-col items-center px-5"
      >
        <Slider.Track class="h-8px relative w-full rounded-full bg-[#2b2b2b]">
          <Slider.Fill class="absolute h-full rounded-full bg-[#414141]" />
          <Slider.Thumb class="h-16px top--4px w-16px bg-background focus:(shadow outline-none) border-border focus:(border-primary h-18px w-18px) block items-center rounded-full border-2 transition-transform hover:shadow">
            <Slider.Input />
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Root>
    </div>
  );
};

const InstantSellView = () => {
  return (
    <Switch>
      <Match when={viewStyle() === "list"}>
        <IntantSellListView />
      </Match>
      <Match when={viewStyle() === "grid_sm"}>
        <InstantSellGridView large={false} />
      </Match>
      <Match when={viewStyle() === "grid_lg"}>
        <InstantSellGridView large={true} />
      </Match>
    </Switch>
  );
};

function CollectionItemView(props: { item: CollectionItemWithProperties }) {
  return (
    <Switch>
      <Match when={viewStyle() === "list"}>
        <CollectionItemListView item={props.item} />
      </Match>
      <Match when={viewStyle() === "grid_sm"}>grid_sm</Match>
      <Match when={viewStyle() === "grid_lg"}>grid_lg</Match>
    </Switch>
  );
}

const ItemsSkeleton = (props: { limits: number }) => (
  <Switch>
    <Match when={viewStyle() === "list"}>
      <ItemsListSkeleton limits={props.limits} />
    </Match>
  </Switch>
);

const id = 1;

export default function CollectionItemsView() {
  const { filter } = useContext(StoreContext);

  const query = trpc.nftCollectionsRouter.collectionItems.useInfiniteQuery(
    () => ({
      collection: id,
      filters: filter,
      minPrice: minPrice(),
      maxPrice: maxPrice(),
      minRarity: filterRarityMin(),
      maxRarity: filterRarityMax(),
      listed: status(),
      marketPlace: marketPlace(),
      limit: 15,
    }),
    () => ({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: () => 0,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    }),
  );

  let filteredItemsListRef: HTMLDivElement | undefined;

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    // console.log(scrollTop, clientHeight, scrollHeight);
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    if (isAtBottom) {
      console.log("fetch next, can I", query.hasNextPage);
      if (query.hasNextPage) query.fetchNextPage();
    } else {
    }
  };
  onMount(() => {
    if (filteredItemsListRef) {
      console.log(filteredItemsListRef);
      filteredItemsListRef.addEventListener("scroll", handleScroll);
    }
  });

  onCleanup(() => {
    if (filteredItemsListRef) {
      filteredItemsListRef.removeEventListener("scroll", handleScroll);
    }
  });

  const totalItems = () =>
    query.data?.pages.reduce((acc, page) => acc + page.items.length, 0);

  const totalPrice = () =>
    query.data?.pages.reduce(
      (acc, page) =>
        acc +
        page.items.reduce((accInner, item) => {
          if (selectedItems().includes(item.id)) {
            return accInner + item.price;
          } else return accInner;
        }, 0),
      0,
    );

  const itemsContainerStyle = () =>
    viewStyle() === "list"
      ? "overflow-auto overflow-y-scroll overflow-x-hidden h-[calc(100%-32px)]"
      : viewStyle() === "grid_sm"
        ? "grid h-full grid-cols-4 gap-12px overflow-auto overflow-y-scroll scrollbar-hide"
        : "grid grid-cols-2 gap-15px overflow-auto overflow-y-scroll scrollbar-hide";

  return (
    <div class="flex h-[calc(100%)] flex-col">
      {/* <Switch fallback={<ItemsSkeleton limits={20} />}> */}
      <Switch>
        <Match when={query.data}>
          <div
            class={itemsContainerStyle()}
            ref={(el) => {
              filteredItemsListRef = el;
            }}
          >
            <Show when={viewStyle() === "list"}>
              <CollectionItemListHeader />
            </Show>
            <InstantSellView />
            <For each={query.data?.pages}>
              {(page) => (
                <For each={page.items}>
                  {(item: CollectionItemWithProperties) => (
                    <CollectionItemView item={item} />
                  )}
                </For>
              )}
            </For>
          </div>
          <Show when={query.isFetchingNextPage}>
            <ItemsSkeleton limits={10} />
          </Show>
        </Match>
        <Match when={query.isLoading}>
          <ItemsSkeleton limits={20} />
        </Match>
        <Match when={query.isError}>
          <div>Error</div>
        </Match>
      </Switch>
      <div class="tabebed-container-action h-52px px-10px bg-background-body border-border flex items-center justify-between border-t">
        <BuyItem totalPrice={totalPrice() || 0} currency="solana" />
        <Sweeper maxSelected={totalItems() || 0} />
      </div>
    </div>
  );
}
