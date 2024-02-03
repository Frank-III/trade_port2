import { createSignal } from "solid-js";

export const [viewStyle, setViewStyle] = createSignal<
  "list" | "grid_sm" | "grid_lg"
>("list");

export const [selectedItems, setSelectedItems] = createSignal<number[]>([]);

export const [timeSpan, setTimeSpan] = createSignal<number>(7);

export const [viewSort, setViewSort] = createSignal<string>("price_asc");

export const [outlier, setOutlier] = createSignal<boolean>(false);

export type ActivityKind =
  | "sales"
  | "listing"
  | "accept_bids"
  | "bids"
  | "transfer"
  | "mints"
  | "stakes"
  | "all";

export const [activityKind, setActivityKind] =
  createSignal<ActivityKind>("all");
