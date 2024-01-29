import type { SearchTableRow } from "./types";
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
  onMount,
} from "solid-js";
import { trpc } from "~/utils/trpc";
import { Image, Skeleton } from "@kobalte/core";
import { A } from "solid-start";
import { currency, catVal, tsVal, search } from "./signals";
import { Properties } from "solid-js/web";

export default function SearchTable() {
  const query = trpc.nftRouter2.trending.useInfiniteQuery(
    () => ({
      kind: currency(),
      ts: tsVal(),
      cat: catVal(),
      limit: 10,
      cursor: null,
    }),
    () => ({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: () => 0,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    }),
  );
  const [lastScrollY, setLastScrollY] = createSignal(window.scrollY);
  let tableHeaderRef: HTMLTableRowElement | undefined;
  // const searchDialog = document.getElementById("searchDialog")!;
  // const searchScroll = document.getElementById("searchScroll")!;
  let searchDialog: HTMLElement;
  let searchScroll: HTMLElement;

  const handleScroll = (event) => {
    // logic here: if scroll down to the bottom, fetch next page, if scroll up to the table header(as we would make header stick at top), fetch prev page
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    //TODO: fix this issue(must be padding or margin)
    if (isAtBottom) {
      // You've reached the bottom of the dialog
      console.log("fetch next");
      query.fetchNextPage();
    } else {
      // if (currentScrollY < lastScrollY()) {
      //   const rect = tableHeaderRef?.getBoundingClientRect();
      //   if (rect && rect.top < 0) {
      //     console.log("fetch prev");
      //     query.fetchPreviousPage();
      //   }
      // }
    }
  };
  setLastScrollY(window.scrollY);
  onMount(() => {
    searchDialog = document.getElementById("searchDialog")!;
    searchScroll = document.getElementById("searchScroll")!;
    searchScroll.addEventListener("scroll", handleScroll);
  });

  //TODO: onMount would set the default data (but maybe do it with suspense?)

  onCleanup(() => {
    searchScroll.removeEventListener("scroll", handleScroll);
  });

  return (
    <div class="mx-auto h-full text-nowrap">
      {/* Table Header */}
      <div class="bg-background border-border flex h-[32px] items-center justify-between border-b-[1px] border-t-[1px] p-[0_0_0_15px]">
        <div class="text-table flex flex-[3_1_0%] items-center">COLLECTION</div>
        <div class="text-table flex flex-[1_1_0%] items-center">FLOOR</div>
        <div class="text-table flex flex-[1_1_0%] items-center">VOLUME</div>
        <div class="text-table flex flex-[1_1_0%] items-center text-nowrap">
          VOLUME USD
        </div>
      </div>
      {/* Table Body */}
      <div class="lt-lg:h-[calc(80vh-80px)] h-[calc(60vh-80px)] overflow-x-hidden overflow-y-scroll">
        <Suspense fallback={<TableRowSkeleton limits={10} />}>
          <Switch>
            <Match when={query.data}>
              <For each={query.data?.pages}>
                {(page) => (
                  <For each={page.items}>
                    {(item: SearchTableRow, idx) => (
                      <TableRow item={item} id={idx().toString()} />
                    )}
                  </For>
                )}
              </For>
              <Show when={query.isFetchingNextPage}>
                <TableRowSkeleton limits={10} />
              </Show>
            </Match>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

function TableRow(props: { item: SearchTableRow } & ComponentProps<"div">) {
  return (
    <A href="#">
      <div class="border-border-color hover:bg-background-hover relative flex flex items-center border-b-[1px] p-[6.5px_0px_6.5px_15px] pt-[8px]">
        <div class="text-table flex-[3_1_0%] overflow-hidden">
          <div class="text-table flex flex-row items-center space-x-3 ">
            <Image.Root fallbackDelay={300} class="h-[42px] w-[42px] ">
              <Image.Img
                class="hover:(border-1 border-primary) rounded-lg object-fill"
                src={props.item.collection.avatar}
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
        <div class="text-table flex-[1_1_0%]">{props.item.floor}</div>
        <div class="text-table flex-[1_1_0%]">{props.item.volume}</div>
        <div class="text-table flex-[1_1_0%]">{props.item.volume_usd}</div>
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
          class="border-border-color relative flex flex items-center border-b-[solid_1px] p-[6.5px_0px_6.5px_15px] pt-[8px]"
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
        </div>
      )}
    </For>
  );
}
