import { createSignal } from "solid-js";

export const [viewStyle, setViewStyle] = createSignal<
	"list" | "grid_sm" | "grid_lg"
>("list");

export const [viewSort, setViewSort] =
	createSignal<string>("Price: Low to High");
