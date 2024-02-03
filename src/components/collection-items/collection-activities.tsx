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
import { createEffect, useContext } from "solid-js";
import { Image } from "@kobalte/core";
import { ItemActivity } from "~/server/trpc/router/_app";
import { StoreContext } from "~/routes/next";

export function ActivityItem(props: { item: ItemActivity }) {
  const ActivityIcon =
    activityIconMap[props.item.type as keyof typeof activityIconMap];
  return (
    <div class="border-border flex flex-row space-x-5 border-b ">
      <div class="activity-left flex w-full flex-col justify-between">
        <Image.Root fallbackDelay={300} class="h-55px w-55px">
          <Image.Img
            class="rounded-lg object-fill"
            src={props.item.item.image || ""}
            alt="item image"
          />
          <Image.Fallback>{props.item.item.name.slice(0, 1)}</Image.Fallback>
        </Image.Root>
        <div class="flex w-full flex-col justify-between text-ellipsis text-nowrap">
          <span class="text-offwhite text-base font-bold">
            {props.item.item.name}
          </span>
          <div class="inline-flex text-sm">
            <div class="i-material-symbols-star text-offwhite text-13px" />
            {props.item.item.rarity}
          </div>
          <div class="inline-flex text-sm">
            <ActivityIcon size={13} />
            {props.item.type}
          </div>
        </div>
      </div>
      <div class="flex-end flex flex-col justify-between">
        <div />
        <span class="text-sm font-normal">{props.item.time}</span>
        <span class="text-wrap text-sm font-normal">
          {props.item.from || props.item.to}
        </span>
      </div>
    </div>
  );
}

export default function ItemsActivitiesView(props: { itemIdx?: number[] }) {
  const { filter } = useContext(StoreContext);
  //FIXME: do I really have itemIdx here??
  // const activitiesQuery = trpc.nftItemsRouter.itemActivities.useInfiniteQuery(
  // 	() => ({
  // 		itemIdx: props.itemIdx ?? undefined,
  // 		activityKind: activityKind(),
  // 	}),
  // 	() => ({
  // 		getNextPageParam: (lastPage) => lastPage.nextCursor,
  // 		initialPageParam: () => 0,
  // 		getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  // 	}),
  // );

  // Seems to work

  return (
    <div class="">
      <div class="px-5px py-5px flex flex-row items-center justify-between ">
        <span class="text-offwhite text-base font-bold">Activity</span>
        <GenericSelect2<ActivityKind>
          options={activityOptions}
          val={activityKind}
          setVal={setActivityKind}
        />
      </div>
    </div>
  );
}
