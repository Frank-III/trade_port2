import { trpc } from "~/utils/trpc";
import {
  activityKind,
  setActivityKind,
  setViewSort,
  viewSort,
  type ActivityKind,
} from "./signals";
import { GenericSelect2 } from "../generic-select";
import { activityOptions, viewSortOptions } from "./val-maps";
import { createEffect } from "solid-js";

export default function ItemsActivitiesView(props: { itemIdx?: number[] }) {
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
    <div>
      Hi
      <div class="flex flex-row justify-between">
        <span>Activity</span>
        <GenericSelect2<ActivityKind>
          options={activityOptions}
          val={activityKind}
          setVal={setActivityKind}
        />
      </div>
    </div>
  );
}
