import { TableProps, TrendingTableRow } from "./types";
import { createSignal, For, createEffect, onMount, onCleanup, Show } from "solid-js";
import { trpc } from "~/utils/trpc";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/generic-table/table-style";

// function TrendingRowView(item: TrendingTableRow) {
//   return
// }
export default function TrendTable(props: TableProps) {
  // const query = trpc.nftRouter.trending.useInfiniteQuery(
  //   () => ({
  //     limit: 20,
  //     cursor: null,
  //   }),
  //   {
  //     getNextPageParam: (lastPage) => lastPage.nextCursor,
  //     initialCursor: 0,
  //     getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  //   },
  // );
  const [lastScrollY, setLastScrollY] = createSignal(window.scrollY);
  let tableHeaderRef: HTMLTableRowElement | undefined;
  const handleScroll = () => {
    // logic here: if scroll down to the bottom, fetch next page, if scroll up to the table header(as we would make header stick at top), fetch prev page
    const currentScrollY = window.scrollY;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // fetchNext();
      console.log("fetch next");
      // query.fetchNextPage()
    } else {
      if (currentScrollY < lastScrollY()) {
        const rect = tableHeaderRef?.getBoundingClientRect();
        if (rect && rect.top < 0) {
          console.log("fetch prev");
          // query.fetchPreviousPage()
        }
      }
    }
    setLastScrollY(window.scrollY);
  };
  createEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  // //TODO: onMount would set the default data (but maybe do it with suspense?)

  // onCleanup(() => {
  //   window.removeEventListener("scroll", handleScroll);
  // });
  // trpc.
  return (
    <Table>
      <TableHeader>
        <TableRow class="sticky" ref={tableHeaderRef}>
          <TableHead class="w-[100px]">COLLECTION</TableHead>
          <TableHead>FLOOR</TableHead>
          <TableHead>MARKET CAP</TableHead>
          <TableHead class="text-right">VOLUME</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* TODO: fix this type thing */}
        {/* <Show when={query.status === "success"} fallback=>
        <For each={query.data as unknown as TrendingTableRow[] }>
          {(item, idx) => (
            <TableRow id={idx.toString()}>
              <TableCell class="w-[100px]">
                <div class="flex flex-row items-center space-x-3">
                  <img
                    class="h-[40px] w-[40px] rounded-full"
                    src={item.collection.avatar}
                    alt=""
                  />
                  <div class="flex flex-col">
                    <div class="text-base-font-more-receding-color">
                      {item.collection.name}
                    </div>
                    <div class="text-base-font-more-receding-color text-xs">
                      {item.collection.supply}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div class="text-base-font-more-receding-color">
                  {item.floor} SOL
                </div>
              </TableCell>
              <TableCell>
                <div class="text-base-font-more-receding-color">
                  {item.market_cap} SOL
                </div>
              </TableCell>
              <TableCell class="text-right">
                <div class="text-base-font-more-receding-color">
                  {item.volume} NFTs
                </div>
              </TableCell>
            </TableRow>
          )}
        </For>
        </Show> */}
      </TableBody>
    </Table>
  );
}
