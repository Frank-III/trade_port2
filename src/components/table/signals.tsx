import { createSignal } from "solid-js";

export const [ts, setTS] = createSignal<number>(1);
export const [cat, setCat] = createSignal<string>("vol");
export const [currency, setCurrency] = createSignal<
  "all" | "solana" | "ethereum"
>("all");

export const [search, setSearch] = createSignal<string>("");

// no sure if I would use
export const [minPrice, setMinPrice] = createSignal<number>(0);
export const [maxPrice, setMaxPrice] = createSignal<number>(10000);

export const [snipperDrawerOpen, setsnipperDrawerOpen] =
  createSignal<boolean>(false);
