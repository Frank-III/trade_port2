import type { TrendingTableRow } from "./types";
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
import { currency, catVal, tsVal, ts, setTS, setCat, cat } from "./signals";
import { CatFilterMap, TimeSpanMap } from "./filter-valmaps";
import { ArrowDownWideNarrow, TimerReset } from "lucide-solid";
import GenericSelect from "./generic-select";

const CurrencyIcons = {
  // all: "https://cdn.lucide.dev/currency-dollar.svg",
  solana: "i-mingcute-solana-sol-line",
  ethereum: "i-mingcute-ethereum-line",
  usd: "i-mingcute-currency-dollar-2-line",
  sui: "i-mingcute-avalanche-avax-line",
};

export default function TrendTable2() {
  const query = trpc.nftRouter.trending.useInfiniteQuery(
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
    setLastScrollY(window.scrollY);
  };
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
      <div
        ref={tableHeaderRef}
        class="sticky top-[57px] z-2 bg-background h-[32px] flex items-center justify-between border-b-[1px] p-[0_0_0_15px] border-border lt-smm:hidden"
      >
        <div class="flex-[3_1_0%] text-table flex items-center">COLLECTION</div>
        <div class="flex-[1_1_0%] text-table flex items-center">FLOOR</div>
        <div class="flex-[1_1_0%] text-table flex items-center text-wrap">
          MARKET CAP
        </div>
        <div class="flex-[1_1_0%] text-table flex items-center">VOLUME</div>
        <div class="flex-[1_1_0%] text-table flex items-center text-wrap">
          VOLUME USD
        </div>
        <div class="flex-[1_1_0%] text-table flex items-center">SALES</div>
        <div class="flex-[0.8_1_0%] text-table flex items-center ">AVERAGE</div>
      </div>
      <div class="hidden lt-smm:flex flex-row border-b-[1px] p-[0_0_5px_15px] border-border justify-end mt-5px space-x-5px">
        <GenericSelect<number>
          valMap={TimeSpanMap}
          val={ts}
          setVal={setTS}
          labelIcon={<TimerReset size={20} class="icon-default" />}
        />
        <GenericSelect<string>
          valMap={CatFilterMap}
          val={cat}
          setVal={setCat}
          labelIcon={<ArrowDownWideNarrow size={20} class="icon-default" />}
        />
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
      <div class="relative flex flex items-center p-[6.5px_0px_6.5px_15px] pt-[8px] border-b-[1px] border-border-color hover:bg-background-hover lt-smm:hidden">
        <div class="flex-[3_1_0%] text-table overflow-hidden">
          <div class="flex flex-row items-center space-x-3 text-table ">
            <Image.Root fallbackDelay={300} class="h-[42px] w-[42px] ">
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
        <div class="flex-[1_1_0%] text-table items-center">
          {props.item.market_cap}
        </div>
        <div class="flex-[1_1_0%] text-table items-center">
          {props.item.volume}
        </div>
        <div class="flex-[1_1_0%] text-table items-center">
          {props.item.volume_usd}
        </div>
        <div class="flex-[1_1_0%] text-table items-center">
          {props.item.sales}
        </div>
        <div class="flex-[0.8_1_0%] text-table items-center">
          {props.item.average}
        </div>
      </div>
      <div class="hidden lt-smm:flex flex-row text-sm font-normal border-b-1 border-border space-x-5 items-center py-5px">
        <Image.Root fallbackDelay={300} class="h-75px w-75px ">
          <Image.Img
            class="object-fill rounded-lg hover:(border-1 border-primary)"
            src={props.item.collection.avatar}
            alt="nft collection avatar"
          />
          <Image.Fallback>
            {props.item.collection.name.slice(0, 1)}
          </Image.Fallback>
        </Image.Root>
        <div class="flex flex-col justify-between w-full ">
          <div class="inline-flex text-sm hover:text-primary">
            {props.item.collection.name}
            <div class="i-codicon-verified-filled text-20px text-primary" />
          </div>
          <div class="flex flex-row justify-between">
            <div class="flex flex-col items-start font-normal text-sm">
              <span>Floor: {props.item.floor}</span>
              <span>Market Cap: {props.item.market_cap}</span>
              <span>Sales: {props.item.sales}</span>
            </div>
            <div class="flex flex-col items-start font-normal text-sm">
              <span>Volume: {props.item.volume}</span>
              <span>Vol USD: {props.item.volume_usd}</span>
              <span>Average: {props.item.average}</span>
            </div>
          </div>
        </div>
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
                  class="h-[42px] w-[42px] rounded-full"
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
