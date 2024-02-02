import { trpc } from "~/utils/trpc";
import { activityKind } from "./signals";

export default function ItemsActivitiesView(props: { itemIdx?: number[] }) {
	const activitiesQuery = trpc.nftItemsRouter.itemActivities.useInfiniteQuery(
		() => ({
			itemIdx: props.itemIdx ?? undefined,
			activityKind: activityKind(),
		}),
		() => ({
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: () => 0,
			getPreviousPageParam: (firstPage) => firstPage.prevCursor,
		}),
	);
}
