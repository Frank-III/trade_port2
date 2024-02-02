import { createSignal } from "solid-js";

export const [viewStyle, setViewStyle] = createSignal<
	"list" | "grid_sm" | "grid_lg"
>("list");

export const [selectedItems, setSelectedItems] = createSignal<number[]>([]);

export const [viewSort, setViewSort] =
	createSignal<string>("Price: Low to High");

export const [activityKind, setActivityKind] = createSignal<
	| "sales"
	| "listing"
	| "accept_bids"
	| "bids"
	| "transfer"
	| "mints"
	| "stakes"
	| "all"
>("all");
