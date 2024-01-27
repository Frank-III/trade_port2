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
import { type CollectionItem } from "~/libs/fake_data";
import { StoreContext } from "~/routes/next";

function CollectionItemView(props: { item: CollectionItem }) {
  return (
    <Switch>
      <Match when={viewStyle() === "list"}>list</Match>
      <Match when={viewStyle() === "grid_sm"}>grid_sm</Match>
      <Match when={viewStyle() === "grid_lg"}>grid_lg</Match>
    </Switch>
  );
}

const name = "April";

export function CollectionItemsView() {
  const { filter, filterSetter } = useContext(StoreContext);

  const query = trpc.nftRouter.collectionItems.useInfiniteQuery(
    () => ({
      collection: name,
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
      <Suspense fallback={<div>loading</div>}>
        <div>
          <Show when={viewStyle() === "list"}></Show>
          <For each={query!.data.page}>
            {(page) => (
              <For each={page.items}>
                {(item: CollectionItem) => <CollectionItemView item={item} />}
              </For>
            )}
          </For>
        </div>
      </Suspense>
    </div>
  );
}
