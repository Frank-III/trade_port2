import { useParams } from "solid-start";
import {
  CollectionDetail,
  CollectionStats,
} from "~/components/collections/collection-detail";
import { Filter } from "~/components/collections/filter";
import Nav from "~/components/nav";
import { trpc } from "~/utils/trpc";
import { ChevronLeft } from "lucide-solid";
import { CollectionItemsTabView } from "~/components/collection-items/colllection-items-view";
import { createStore, SetStoreFunction } from "solid-js/store";
import { createContext, createEffect, Suspense } from "solid-js";

const name = "April";

type StoreContext = {
  filter: Record<string, Array<string>>;
  filterSetter: SetStoreFunction<Record<string, Array<string>>>;
};

export const StoreContext = createContext<StoreContext>({
  filter: {},
  filterSetter: () => {},
});

const Next = () => {
  const collectionDetailQuery = trpc.nftRouter.collectionProperties.useQuery(
    () => ({
      kind: "solana",
      name: name,
    }),
  );

  // wait for the query to be ready to create the store: how
  const [filter, setFilter] = createStore(
    Object.keys(collectionDetailQuery.data?.allProperties).reduce(
      (acc: Record<string, Array<string>>, key) => {
        acc[key] = [];
        return acc;
      },
      {},
    ),
  );

  // let filter: Record<string, Array<string>>;
  // let setFilter: SetStoreFunction<Record<string, Array<string>>>;
  // createEffect(() => {
  //   if (collectionDetailQuery.data) {
  //     console.log(collectionDetailQuery.data[0]);
  //     [(filter, setFilter)] = createStore(
  //       Object.keys(collectionDetailQuery.data?.allProperties).reduce(
  //         (acc: Record<string, Array<string>>, key) => {
  //           acc[key] = [];
  //           return acc;
  //         },
  //         {},
  //       ),
  //     );
  //   }
  // });

  return (
    <main>
      <Nav />
      <div class="page-container m-auto max-w-[1600px] p-[58px_20px_15px] ">
        <div class="collection-layout gap-10px w-100% flex flex-col ">
          <div class="collection-top gap-10px gap-y-10px flex flex-wrap items-center justify-between">
            <CollectionDetail collectionName={name} />
            <CollectionStats collectionName={name} />
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <StoreContext.Provider value={{ filter, filterSetter: setFilter }}>
              <div class="collection-bottom lt-lg:h-auto flex h-[calc(100vh-180px)] w-full overflow-auto">
                <div class="collection-filter">
                  <div class="flex flex-row">
                    <Filter collection={collectionDetailQuery.data!} />
                    <div class="border-1 border-border flex items-center justify-center border hover:bg-[#271C10]">
                      <ChevronLeft />
                    </div>
                  </div>
                </div>
                <div class="collection-items-and-chart flex flex-grow flex-col ">
                  <div class="collection-items border-border border-t"></div>
                  <CollectionItemsTabView />
                </div>
                <div class="activities border-border lt-lg:hidden h-[cal(40vh-87px)] overflow-hidden border-y"></div>
              </div>
            </StoreContext.Provider>
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default Next;
