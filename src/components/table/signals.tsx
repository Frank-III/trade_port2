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
