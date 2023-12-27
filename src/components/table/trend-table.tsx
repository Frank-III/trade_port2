import type { TableProps, TrendingTableRow } from "./types";
import {
  createSignal,
  For,
  createEffect,
  onCleanup,
  Show,
  Suspense,
  Match,
  Switch,
  type ComponentProps,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import { Image, Skeleton } from "@kobalte/core";
import { cn } from "~/utils/cn";
import { A } from "solid-start";

const CurrencyIcons = {
  // all: "https://cdn.lucide.dev/currency-dollar.svg",
  solana: "i-mingcute-solana-sol-line",
  ethereum: "i-mingcute-ethereum-line",
  usd: "i-mingcute-currency-dollar-2-line",
  sui: "i-mingcute-avalanche-avax-line",
};

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
    //TODO: fix this issue(must be padding or margin)
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
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
    <div class="mx-auto h-full text-nowrap">
      {/* Table Header */}
      <div class="sticky top-[57px] z-3 bg-background h-[32px] flex items-center justify-between border-b-[1px] p-[0_0_0_15px] border-border">
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
    <A href="#">
      <div class="relative flex flex items-center p-[6.5px_0px_6.5px_15px] pt-[8px] border-b-[1px] border-border-color hover:bg-background-hover">
        <div class="flex-[3_1_0%] text-table overflow-hidden">
          <div class="flex flex-row items-center space-x-3 text-table ">
            <Image.Root fallbackDelay={300} class="h-[40px] w-[40px] ">
              <Image.Img
                class="object-fill rounded-lg hover:(border-1 border-primary)"
                src={props.item.collection.avatar}
                alt="nft collection avatar"
              />
              <Image.Fallback>
                {props.item.collection.name.slice(0, 1)}
              </Image.Fallback>
            </Image.Root>
            <div class="flex flex-col">
              <div class="text-table group hover:(text-primary)">
                {props.item.collection.name}
              </div>
              <div class="text-table text-base-font-receding-color">
                {props.item.collection.supply}
              </div>
            </div>
          </div>
        </div>
        <div class="flex-[1_1_0%] text-table">
          <div class="text-table">
            <div class={cn(CurrencyIcons[props.item.kind], "text-15px")} />
            {props.item.floor.toFixed(1)}
          </div>
        </div>
        <div class="flex-[1_1_0%] text-table">{props.item.market_cap}</div>
        <div class="flex-[1_1_0%] text-table">{props.item.volume}</div>
        <div class="flex-[1_1_0%] text-table">{props.item.volume_usd}</div>
        <div class="flex-[1_1_0%] text-table">{props.item.sales}</div>
        <div class="flex-[0.8_1_0%] text-table">{props.item.average}</div>
      </div>
    </A>
  );
}

export function TableRowSkeleton(props: { limits: number }) {
  return (
    <For each={Array.from({ length: props.limits }, (_, i) => i)}>
      {(item, idx) => (
        <div
          id={idx.toString()}
          class="relative flex flex items-center p-[6.5px_0px_6.5px_15px] pt-[8px] border-b-[solid_1px] border-border-color"
        >
          <div class="flex-[3_1_0%] overflow-hidden ">
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
