import { createSignal } from "solid-js";

export const [status, setStatus] = createSignal<"listed" | "unlisted" | "all">(
  "all",
);
export const [filterSearch, setFilterSearch] = createSignal<string>("");
export const [filterListed, setFilterListed] = createSignal<boolean>(true);

export const [marketPlace, setMarketPlace] = createSignal<string[]>([]);

export const [minPrice, setMinPrice] = createSignal<number>(0);
export const [maxPrice, setMaxPrice] = createSignal<number>(10000);

export const [filterRarityMin, setFilterRarityMin] = createSignal<number>(1);
export const [filterRarityMax, setFilterRarityMax] = createSignal<number>(5000);

export const [filterDialogOpen, setFilterDialogOpen] =
  createSignal<boolean>(false);
