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
import { cat, currency, search, ts } from "./signals";
import { Properties } from "solid-js/web";

export default function SearchTable() {
  const query = trpc.nftCollectionsRouter.trending.useInfiniteQuery(
    () => ({
      kind: currency(),
      ts: ts(),
      cat: cat(),
      limit: 15,
      cursor: null,
    }),
    () => ({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: () => 0,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    }),
  );
  // const [lastScrollY, setLastScrollY] = createSignal(window.scrollY);
  let tableListRef: HTMLDivElement | undefined;

  // logic here: if scroll down to the bottom, fetch next page, if scroll up to the table header(as we would make header stick at top), fetch prev page
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    if (isAtBottom) {
      // You've reached the bottom of the dialog
      // console.log("fetch next, can I", query.hasNextPage);
      if (query.hasNextPage) query.fetchNextPage();
    } else {
    }
  };
  onMount(() => {
    if (tableListRef) {
      console.log("tableListRef", tableListRef);
      tableListRef.addEventListener("scroll", handleScroll);
    }
  });

  onCleanup(() => {
    if (tableListRef) tableListRef.removeEventListener("scroll", handleScroll);
  });
  return (
    <div class="mx-auto h-full text-nowrap" id="tableListRef">
      {/* Table Header */}
      <div class="bg-background border-border lt-smmm:hidden flex h-[32px] items-center justify-between border-b-[1px] border-t p-[0_0_0_15px]">
        <div class="text-table flex flex-[3_1_0%] items-center">COLLECTION</div>
        <div class="text-table flex flex-[1_1_0%] items-center">FLOOR</div>
        <div class="text-table flex flex-[1_1_0%] items-center">VOLUME</div>
        <div class="text-table flex flex-[1_1_0%] items-center text-nowrap">
          VOLUME USD
        </div>
      </div>
      {/* Table Body */}
      <div
        ref={(el) => {
          tableListRef = el;
        }}
        class="lt-lg:max-h-[calc(80vh-75px)] scrollbar-hide h-[calc(100%-32px)] max-h-[calc(60vh-80px)] overflow-x-hidden overflow-y-scroll"
      >
        <Suspense fallback={<TableRowSkeleton limits={15} />}>
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
                <TableRowSkeleton limits={15} />
              </Show>
            </Match>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

function TableRow(props: { item: any } & ComponentProps<"div">) {
  return (
    <A href="#" class="">
      <div class="border-border-color hover:bg-background-hover lt-smmm:hidden relative flex flex items-center border-b-[1px] p-[6.5px_0px_6.5px_15px] pt-[8px]">
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
      <div class="lt-smmm:flex border-b-1 border-border px-5px py-5px hover:bg-background-hover hidden flex-row items-center space-x-5 text-sm font-normal">
        <Image.Root fallbackDelay={300} class="h-55px w-55px">
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
              <span>Supply: {props.item.collection.supply}</span>
              <span>Floor: {props.item.floor}</span>
            </div>
            <div class="flex flex-col items-start text-sm font-normal">
              <span>Volume: {props.item.volume}</span>
              <span>Vol USD: {props.item.volume_usd}</span>
            </div>
          </div>
        </div>
      </div>
    </A>
  );
}

export function TableRowSkeleton(props: { limits: number }) {
  const extraStyles = { width: "60%", height: "60%" };
  return (
    <For each={Array.from({ length: props.limits }, (_, i) => i)}>
      {(item, idx) => (
        <>
          <div
            id={idx.toString()}
            class="border-border-color lt-smmm:hidden relative flex flex items-center border-b-[solid_1px] p-[6.5px_0px_6.5px_15px] pt-[8px]"
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
          <div class="lt-smmm:flex border-b-1 border-border py-5px px-5px hidden flex-row items-center space-x-5 text-sm font-normal">
            <Skeleton.Root
              class="skeleton"
              radius={5}
              style={{ width: "auto", height: "auto" }}
            >
              <img
                class="h-[55px] w-[55px] rounded-full"
                alt="nft collection avatar"
              />
            </Skeleton.Root>
            <div class="flex w-full flex-col justify-between">
              <Skeleton.Root
                class="skeleton mb-5px"
                radius={5}
                style={{ width: "50%" }}
              >
                <div class="hover:text-primary inline-flex text-sm">
                  name
                  <div class="i-codicon-verified-filled text-20px text-primary" />
                </div>
              </Skeleton.Root>
              <div class="flex flex-row justify-between">
                <div class="space-y-3px flex flex-col items-start text-sm font-normal">
                  <Skeleton.Root
                    class="skeleton"
                    radius={5}
                    style={extraStyles}
                  >
                    <span>Floor:100 NFTs</span>
                  </Skeleton.Root>
                  <Skeleton.Root
                    class="skeleton"
                    radius={5}
                    style={extraStyles}
                  >
                    <span>Market Cap: 100 NFTs</span>
                  </Skeleton.Root>
                </div>
                <div class="space-y-3px flex flex-col items-end text-sm font-normal">
                  <Skeleton.Root
                    class="skeleton"
                    radius={5}
                    style={extraStyles}
                  >
                    <span>Volume: 100 NFTs</span>
                  </Skeleton.Root>
                  <Skeleton.Root
                    class="skeleton"
                    radius={5}
                    style={extraStyles}
                  >
                    <span>Vol USD: 100 NFTs</span>
                  </Skeleton.Root>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </For>
  );
}
