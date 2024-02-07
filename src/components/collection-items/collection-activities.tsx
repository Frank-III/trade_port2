import { trpc } from "~/utils/trpc";
import {
  activityKind,
  setActivityKind,
  setViewSort,
  viewSort,
  type ActivityKind,
} from "./signals";
import { GenericSelect2 } from "../generic-select";
import { activityOptions, viewSortOptions, activityIconMap } from "./val-maps";
import {
  createEffect,
  For,
  Match,
  Switch,
  useContext,
  Show,
  onMount,
  onCleanup,
  Suspense,
} from "solid-js";
import { Image, Skeleton } from "@kobalte/core";
import { type ItemActivity } from "~/server/trpc/router/_app";
import { StoreContext } from "~/routes/next";
import "~/components/table/skeleton.css";

export function ActivityItem(props: { item: ItemActivity }) {
  // const ActivityIcon =
  //   activityIconMap[props.item.type as keyof typeof activityIconMap];
  const textStyle = "text-sm font-normal h-19.5px";
  return (
    <div class="border-border min-h-70px px-10px relative flex flex-row items-center space-x-5 border-b">
      <div class="activity-left flex w-full flex-1 items-center justify-between overflow-hidden">
        <Image.Root fallbackDelay={300} class="">
          <Image.Img
            class="h-55px w-55px rounded-lg object-fill"
            src={props.item.item.image || ""}
            alt="nft collection avatar"
          />
          <Image.Fallback>{props.item.item.name.slice(0, 1)}</Image.Fallback>
        </Image.Root>
        <div class="flex w-full flex-col justify-between overflow-hidden text-ellipsis text-nowrap">
          <span class={textStyle}>{props.item.item.name}</span>
          <div class={`${textStyle} inline-flex`}>
            <div class="i-material-symbols-star text-offwhite text-13px" />
            {props.item.item.rarity}
          </div>
          <div class={`${textStyle} inline-flex`}>
            {/* <ActivityIcon size={13} /> */}
            {props.item.type}
          </div>
        </div>
      </div>
      <div class="flex-end flex flex-col justify-between">
        <div class={textStyle} />
        <span class={textStyle}>{props.item.time}</span>
        <span class="max-w-70px truncate text-nowrap  text-sm font-normal">
          {props.item.from || props.item.to}
        </span>
      </div>
    </div>
  );
}

export function ActivitySkeleton(props: { limits: number }) {
  const textStyle = "text-sm font-normal h-19.5px";

  const extraStyles = { width: "60%" };
  return (
    <For each={Array(props.limits).fill("")}>
      {(_) => (
        <div class="border-border min-h-70px px-10px relative flex flex-row items-center space-x-5 border-b">
          <div class="activity-left flex w-full flex-1 items-center justify-between overflow-hidden">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <Image.Root fallbackDelay={300} class="">
                <Image.Img
                  class="h-55px w-55px rounded-lg object-fill"
                  src={""}
                  alt="nft collection avatar"
                />
                <Image.Fallback>JD</Image.Fallback>
              </Image.Root>
            </Skeleton.Root>
            <div class="flex w-full flex-col justify-between overflow-hidden text-ellipsis text-nowrap">
              <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
                <span class={textStyle}>Frank</span>
              </Skeleton.Root>

              <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
                <div class={`${textStyle} inline-flex`}>
                  <div class="i-material-symbols-star text-offwhite text-13px" />
                  {3145}
                </div>
              </Skeleton.Root>
              <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
                <div class={`${textStyle} inline-flex`}>
                  {/* <ActivityIcon size={13} /> */}
                  {"all"}
                </div>
              </Skeleton.Root>
            </div>
          </div>
          <div class="flex-end flex flex-col justify-between">
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class={textStyle} />
            </Skeleton.Root>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <span class={textStyle}>20 minutes ago</span>
            </Skeleton.Root>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <span class="max-w-70px truncate text-nowrap  text-sm font-normal">
                6ac193e8-2126-4b3f-8711-6d746bb9beff
              </span>
            </Skeleton.Root>
          </div>
        </div>
      )}
    </For>
  );
}

export default function ItemsActivitiesView(props: {
  itemIdx?: number[];
  filter: Record<string, number[]>;
}) {
  //FIXME: do I really have itemIdx here??
  const activitiesQuery = trpc.nftItemsRouter.itemActivities.useInfiniteQuery(
    () => ({
      itemIdx: props.itemIdx ?? undefined,
      activityKind: activityKind(),
      limit: 20,
      cursor: null,
    }),
    () => ({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: () => 0,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    }),
  );

  let activityListRef: HTMLDivElement | null;
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    if (isAtBottom) {
      // You've reached the bottom of the dialog
      console.log("fetch next, could I ?", activitiesQuery.hasNextPage);
      if (activitiesQuery.hasNextPage) activitiesQuery.fetchNextPage();
    } else {
    }
  };

  onMount(() => {
    if (activityListRef) {
      // console.log("tableListRef", activityListRef);
      activityListRef.addEventListener("scroll", handleScroll);
    }
  });

  onCleanup(() => {
    if (activityListRef) {
      activityListRef.removeEventListener("scroll", handleScroll);
    }
  });

  return (
    <div class="h-full">
      <div class="px-5px py-5px flex flex-row items-center justify-between ">
        <span class="text-offwhite text-base font-bold">Activity</span>
        <GenericSelect2<ActivityKind>
          options={activityOptions}
          val={activityKind}
          setVal={setActivityKind}
        />
      </div>
      <div
        ref={(el) => {
          activityListRef = el;
        }}
        class="activities-container scrollbar-hide flex h-full flex-col overflow-auto overflow-x-hidden overflow-y-scroll"
      >
        <Suspense fallback={<ActivitySkeleton limits={20} />}>
          <Switch>
            <Match when={activitiesQuery.data}>
              <For each={activitiesQuery.data?.pages}>
                {(page) => (
                  <For each={page.items}>
                    {(item) => item && <ActivityItem item={item} />}
                  </For>
                )}
              </For>
              <Show when={activitiesQuery.isFetchingNextPage}>
                <ActivitySkeleton limits={10} />
              </Show>
            </Match>
            <Match
              when={
                activitiesQuery.isLoading && !activitiesQuery.isFetchingNextPage
              }
            >
              <ActivitySkeleton limits={10} />
            </Match>
            <Match when={activitiesQuery.isError}>
              <div>Error</div>
            </Match>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}
