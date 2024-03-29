import {
  CollectionDetail,
  CollectionStats,
} from "~/components/collections/collection-detail";
// import Filter from "~/components/collections/filter";
import Nav from "~/components/nav";
import { trpc } from "~/utils/trpc";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-solid";
// import CollectionItemsTabView from "~/components/collection-items/colllection-items-tab-view";
const CollectionItemsTabView = lazy(
  () => import("~/components/collection-items/colllection-items-tab-view"),
);
import { createStore, type SetStoreFunction } from "solid-js/store";
import { createContext, createEffect, lazy, Show, Suspense } from "solid-js";
const Filter = lazy(() => import("~/components/collections/filter"));
import { unstable_clientOnly, useParams } from "solid-start";
const ActivityChartView = unstable_clientOnly(
  () => import("~/components/collection-items/chart-view"),
);
import ItemsActivitiesView from "~/components/collection-items/collection-activities";
import { LeftDrawer } from "~/components/drawer";

const DetailPage = () => {
  const params = useParams<{
    kind: "all" | "solana" | "ethereum";
    id: string;
  }>();
  console.log(params.kind, params.id);
  const collectionDetailQuery =
    trpc.nftCollectionsRouter.collectionProperties.useQuery(
      () => ({
        kind: params.kind,
        id: Number(params.id),
      }),
      () => ({
        // staleTime: Infinity,
        catchTime: 0,
        retry: false,
      }),
    );

  // wait for the query to be ready to create the store: how
  // const [filter, setFilter] = createStore(
  // 	collectionDetailQuery.data?.attributes.reduce(
  // 		(acc: Record<string, Array<number>>, val) => {
  // 			acc[val.id] = [];
  // 			return acc;
  // 		},
  // 		{},
  // 	),
  // );

  const [filter, setFilter] = createStore<Record<string, number[]>>({});

  createEffect(() => {
    if (collectionDetailQuery.data) {
      const newFilter = collectionDetailQuery.data.attributes.reduce(
        (acc: Record<string, Array<number>>, val) => {
          acc[val.id] = [];
          return acc;
        },
        {},
      );
      setFilter(newFilter);
    }
  });

  return (
    <main class="">
      <Nav />
      <Show
        when={collectionDetailQuery.data && Object.keys(filter).length > 0}
        fallback={
          <div class="jusity-center flex h-full w-full items-center">
            filter not ready yet
          </div>
        }
      >
        <div class="page-container m-auto max-w-[1600px] p-[58px_20px_15px] ">
          <div class="collection-layout gap-10px w-100% flex flex-col ">
            <div class="collection-top gap-10px gap-y-10px flex flex-wrap items-center justify-between">
              <CollectionDetail collection={collectionDetailQuery.data} />
              <CollectionStats collection={collectionDetailQuery.data} />
            </div>
            <div class="collection-bottom lt-lg:h-auto flex h-[calc(100vh-180px)] w-full ">
              <div class="collection-filter">
                <div class="rounded-tl-10px rounded-bl-10px lt-lgg:hidden border-border border-r-none flex h-full w-[280px] flex-row border transition-all">
                  <div class="w-258px transition-width scrollbar-hide">
                    <Filter
                      collection={collectionDetailQuery.data}
                      filter={filter}
                      filterSetter={setFilter}
                    />
                  </div>
                  <div class="border-border flex items-center justify-center border-l hover:bg-[#271C10]">
                    <ChevronLeft />
                  </div>
                </div>
              </div>
              <div class="collection-items-and-chart lt-lg:(border-b border-border rounded-10px border-r) flex flex-grow flex-col ">
                <div class="collection-items border-border lt-lgg:rounded-tl-10px border-l border-t ">
                  <CollectionItemsTabView
                    filter={filter}
                    collectionId={collectionDetailQuery.data?.id!}
                  />
                </div>
                <div class="items-activity-charts border-border lt-lg:hidden flex h-[calc(40vh-87px)] flex-col overflow-hidden border-b border-l border-t">
                  <div class="collapse-right border-border py-1px flex w-full items-center justify-center border-b hover:bg-[#271C10]">
                    <ChevronDown size={15} />
                  </div>
                  <ActivityChartView fallback={<div>loading</div>} />
                </div>
              </div>
              <div class="activities w-330px border-border lt-lg:hidden rounded-tr-10px rounded-br-10px lt-lg:hidden flex flex-row overflow-hidden border-b border-l border-r border-t">
                <div class="collapse-right border-border px-1px w-20px flex h-full items-center justify-center border-l border-r hover:bg-[#271C10]">
                  <ChevronRight size={15} />
                </div>
                {/* TODO: ultimately, I would have a items-with-activities view that would cover the whole element*/}
                <div class="activities flex h-[calc(100vh-210px)] w-full flex-col">
                  <ItemsActivitiesView filter={filter} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <LeftDrawer
          collection={collectionDetailQuery.data}
          filter={filter}
          filterSetter={setFilter}
        />
      </Show>
    </main>
  );
};

export default DetailPage;
