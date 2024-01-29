import { For, Match, Show, Suspense, Switch, useContext } from "solid-js";
import { viewStyle } from "./signals";
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
import { CollectionItemListHeader, ItemsListSkeleton } from "./list-view";

function CollectionItemView(props: { item: CollectionItemWithProperties }) {
  return (
    <Switch>
      <Match when={viewStyle() === "list"}>list</Match>
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

export function CollectionItemsView() {
  const { filter } = useContext(StoreContext);

  const query = trpc.nftRouter2.collectionItems.useInfiniteQuery(
    () => ({
      collection: id,
      filters: filter,
      minPrice: minPrice(),
      maxPrice: maxPrice(),
      minRarity: filterRarityMin(),
      maxRarity: filterRarityMax(),
      listed: status(),
      marketPlace: marketPlace(),
    }),
    () => ({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: () => 0,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    }),
  );

  return (
    <div class="flex flex-col">
      <div>
        <Suspense fallback={<ItemsSkeleton limits={10} />}>
          <Show when={viewStyle() === "list"}>
            <CollectionItemListHeader />
          </Show>
          <Switch>
            <Match when={query.data}>
              <For each={query.data?.pages} fallback={<div>loading1</div>}>
                {(page) => (
                  <For each={page.items} fallback={<div>loading2</div>}>
                    {(item: CollectionItemWithProperties) => (
                      <CollectionItemView item={item} />
                    )}
                  </For>
                )}
              </For>
            </Match>
            <Match when={query.isFetchingNextPage}>
              <CollectionItemSkeleton limits={10} />
            </Match>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}
