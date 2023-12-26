import { TableProps, type TrendingTableRow } from "./types";
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
  ComponentProps,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import { Image, Skeleton } from "@kobalte/core";

export default function TrendTable2(props: TableProps) {
  const query = trpc.nftRouter.trending.useInfiniteQuery(
    () => ({
      kind: props.currency(),
      ts: props.ts(),
      cat: props.cat(),
      limit: 20,
      cursor: null,
    }),
    () => ({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: () => 0,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    })
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
  };
  setLastScrollY(window.scrollY);
  createEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  //TODO: onMount would set the default data (but maybe do it with suspense?)

  onCleanup(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div class="h-full mx-auto mb-0 overflow-visible text-nowrap">
      {/* Table Header */}
      <div class="sticky top-[57px] z-3 bg-background h-[32px] flex items-center justify-between border-b-[solid_1] p-[0_0_0_15px]">
        <div class="flex-[3_1_0%] text-table flex items-center">COLLECTION</div>
        <div class="flex-[1_1_0%] text-table flex items-center">FLOOR</div>
        <div class="flex-[1_1_0%] text-table flex items-center text-nowrap">
          MARKET CAP
        </div>
        <div class="flex-[1_1_0%] text-table flex items-center">VOLUME</div>
        <div class="flex-[1_1_0%] text-table flex items-center text-nowrap">
          VOLUME USD
        </div>
        <div class="flex-[1_1_0%] text-table flex items-center">SALES</div>
        <div class="flex-[0.8_1_0%] text-table flex items-center text-nowrap">
          AVERAGE
        </div>
      </div>
      {/* Table Body */}
      <Suspense fallback={<TableRowSkeleton limits={20} />}>
        <Switch>
          <Match when={query.data}>
            <For each={query.data?.pages}>
              {(page) => (
                <For each={page.items}>
                  {(item: TrendingTableRow, idx) => (
                    <TableRow item={item} id={idx().toString()} />
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
    </div>
  );
}

function TableRow(props: { item: TrendingTableRow } & ComponentProps<"div">) {
  return (
    <div class="relative flex flex items-center p-[6.5px_0px_6.5px_15px] pt-[8px] border-b-[solid_1px] ">
      <div class="flex-[3_1_0%] text-table overflow-hidden">COLLECTION</div>
      <div class="flex-[1_1_0%] text-table">FLOOR</div>
      <div class="flex-[1_1_0%] text-table">MARKET CAP</div>
      <div class="flex-[1_1_0%] text-table">VOLUME</div>
      <div class="flex-[1_1_0%] text-table">VOLUME USD</div>
      <div class="flex-[1_1_0%] text-table">SALES</div>
      <div class="flex-[0.8_1_0%] text-table">AVERAGE</div>
    </div>
  );
}

export function TableRowSkeleton(props: { limits: number }) {
  return (
    <For each={Array.from({ length: props.limits }, (_, i) => i)}>
      {(item, idx) => (
        <div id={idx.toString()} class="">
          <div class="flex-[3_1_0%] overflow-hidden">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="flex flex-row items-center space-x-3">
                <img
                  class="h-[40px] w-[40px] rounded-full"
                  alt="nft collection avatar"
                />
                <div class="flex flex-col">
                  <div class="text-table">name</div>
                  <div class="text-table text-xs">supply</div>
                </div>
              </div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[0.8_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">10 NFTs</div>
            </Skeleton.Root>
          </div>
        </div>
      )}
    </For>
  );
}
