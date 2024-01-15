import { createSignal } from "solid-js";

export const [filterSearch, setFilterSearch] = createSignal<string>("");
export const [filterListed, setFilterListed] = createSignal<boolean>(true);

export const [marketPlace, setMarketPlace] = createSignal<string>("all");

export const [minPrice, setMinPrice] = createSignal<number>(0);
export const [maxPrice, setMaxPrice] = createSignal<number>(10000);

export const [rarity, setRarity] = createSignal<string>("all");
