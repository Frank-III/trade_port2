import { createSignal } from "solid-js";
import { CatFilterMap, TimeSpanMap } from "./filter-valmaps";

export const [ts, setTS] = createSignal<string>("24 Hrs");
export const [cat, setCat] = createSignal<string>("Volume");
export const [currency, setCurrency] = createSignal<
  "all" | "solana" | "ethereum"
>("all");

export const [search, setSearch] = createSignal<string>("");

export const tsVal = () => TimeSpanMap.get(ts())!;
export const catVal = () => CatFilterMap.get(cat())!;

// no sure if I would use
export const [minPrice, setMinPrice] = createSignal<number>(0);
export const [maxPrice, setMaxPrice] = createSignal<number>(10000);

export const [snipperDrawerOpen, setsnipperDrawerOpen] =
  createSignal<boolean>(false);
