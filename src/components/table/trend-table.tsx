import {
  createSignal,
  For,
  onCleanup,
  Show,
  Suspense,
  Match,
  Switch,
  type ComponentProps,
  onMount,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import { Image, Skeleton } from "@kobalte/core";
import { cn } from "~/utils/cn";
import { A } from "solid-start";
import { currency, ts, setTS, setCat, cat } from "./signals";
import { ArrowDownWideNarrow, TimerReset } from "lucide-solid";
import { GenericSelect2 } from "../generic-select";
import "./skeleton.css";
import { catOptions, tsOptions } from "./filter-valmaps";
import { type TrendingRow } from "~/server/trpc/router/_app";

const CurrencyIcons = {
  // all: "https://cdn.lucide.dev/currency-dollar.svg",
  solana: "i-mingcute-solana-sol-line",
  ethereum: "i-mingcute-ethereum-line",
  usd: "i-mingcute-currency-dollar-2-line",
  sui: "i-mingcute-avalanche-avax-line",
};

export default function TrendTable2() {
  const query = trpc.nftCollectionsRouter.trending.useInfiniteQuery(
    () => ({
      kind: currency(),
      ts: ts(),
      cat: cat(),
      limit: 20,
      cursor: null,
    }),
    () => ({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: () => 0,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    }),
  );

  // logic here: if scroll down to the bottom, fetch next page, if scroll up to the table header(as we would make header stick at top), fetch prev page
  const [lastScrollY, setLastScrollY] = createSignal(window.scrollY);
  let tableHeaderRef: HTMLTableRowElement | undefined;
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
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
  onMount(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", handleScroll);
  });
  //TODO: onMount would set the default data (but maybe do it with suspense?)

  return (
    <div class="mx-auto h-full text-nowrap">
      {/* Table Header */}
      <div
        ref={tableHeaderRef}
        class="z-2 bg-background border-border lt-smm:hidden sticky top-[57px] flex h-[32px] items-center justify-between border-b-[1px] p-[0_0_0_15px]"
      >
        <div class="text-table flex flex-[3_1_0%] items-center">COLLECTION</div>
        <div class="text-table flex flex-[1_1_0%] items-center">FLOOR</div>
        <div class="text-table flex flex-[1_1_0%] items-center text-wrap">
          MARKET CAP
        </div>
        <div class="text-table flex flex-[1_1_0%] items-center">VOLUME</div>
        <div class="text-table flex flex-[1_1_0%] items-center text-wrap">
          VOLUME USD
        </div>
        <div class="text-table flex flex-[1_1_0%] items-center">SALES</div>
        <div class="text-table flex flex-[0.8_1_0%] items-center ">AVERAGE</div>
      </div>
      <div class="lt-smm:flex border-border mt-5px space-x-5px hidden flex-row justify-end border-b-[1px] p-[0_0_5px_15px]">
        <GenericSelect2<number>
          options={tsOptions}
          val={ts}
          setVal={setTS}
          defaultIcon={<TimerReset size={20} class="icon-default" />}
        />
        <GenericSelect2<string>
          options={catOptions}
          val={cat}
          setVal={setCat}
          defaultIcon={<ArrowDownWideNarrow size={20} class="icon-default" />}
        />
      </div>
      {/* Table Body */}
      <Suspense fallback={<TableRowSkeleton limits={20} />}>
        <Switch>
          <Match when={query.data}>
            <For each={query.data?.pages}>
              {(page) => (
                <For each={page.items}>
                  {(item, idx) => (
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

//TODO: fix the item type here
function TableRow(props: { item: TrendingRow } & ComponentProps<"div">) {
  return (
    <A href={`/${props.item.kind}/${props.item.collection.id}`}>
      <div class="border-border-color hover:bg-background-hover lt-smm:hidden relative flex flex items-center border-b-[1px] p-[6.5px_0px_6.5px_15px] pt-[8px]">
        <div class="text-table flex-[3_1_0%] overflow-hidden">
          <div class="text-table flex flex-row items-center space-x-3 ">
            <Image.Root fallbackDelay={300} class="h-[42px] w-[42px] ">
              <Image.Img
                class="hover:(border-1 border-primary) rounded-lg object-fill"
                src={props.item.collection.avatar || ""}
                alt="nft collection avatar"
              />
              <Image.Fallback>
                {props.item.collection.name.slice(0, 1)}
              </Image.Fallback>
            </Image.Root>
            <div class="flex flex-col">
              <div class="text-table hover:(text-primary) group">
                {props.item.collection.name}
              </div>
              <div class="text-table text-base-font-receding-color">
                {props.item.collection.supply}
              </div>
            </div>
          </div>
        </div>
        <div class="text-table flex-[1_1_0%]">
          <div class="text-table">
            <div class={cn(CurrencyIcons[props.item.kind], "text-15px")} />
            {props.item.floor.toFixed(1)}
          </div>
        </div>
        <div class="text-table flex-[1_1_0%] items-center">
          {props.item.market_cap}
        </div>
        <div class="text-table flex-[1_1_0%] items-center">
          {props.item.volume}
        </div>
        <div class="text-table flex-[1_1_0%] items-center">
          {props.item.volume_usd}
        </div>
        <div class="text-table flex-[1_1_0%] items-center">
          {props.item.sales}
        </div>
        <div class="text-table flex-[0.8_1_0%] items-center">
          {props.item.average}
        </div>
      </div>
      <div class="lt-smm:flex border-b-1 border-border py-5px hidden flex-row items-center space-x-5 text-sm font-normal">
        <Image.Root fallbackDelay={300} class="h-75px w-75px ">
          <Image.Img
            class="hover:(border-1 border-primary) rounded-lg object-fill"
            src={props.item.collection.avatar || ""}
            alt="nft collection avatar"
          />
          <Image.Fallback>
            {props.item.collection.name.slice(0, 1)}
          </Image.Fallback>
        </Image.Root>
        <div class="flex w-full flex-col justify-between ">
          <div class="hover:text-primary inline-flex text-sm">
            {props.item.collection.name}
            <div class="i-codicon-verified-filled text-20px text-primary" />
          </div>
          <div class="flex flex-row justify-between">
            <div class="flex flex-col items-start text-sm font-normal">
              <span>Floor: {props.item.floor}</span>
              <span>Market Cap: {props.item.market_cap}</span>
              <span>Sales: {props.item.sales}</span>
            </div>
            <div class="flex flex-col items-start text-sm font-normal">
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
  const extraStyles = { width: "60%" };
  return (
    <For each={Array.from({ length: props.limits }, (_, i) => i)}>
      {(item, idx) => (
        <div
          id={idx.toString()}
          class="border-border-color relative flex flex items-center border-b-[solid_1px] p-[6.5px_0px_6.5px_15px] pt-[8px]"
        >
          <div class="flex-[3_1_0%] overflow-hidden">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
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
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[0.8_1_0%]">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">10 NFTs</div>
            </Skeleton.Root>
          </div>
        </div>
      )}
    </For>
  );
}
