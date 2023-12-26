import { createSignal, For } from "solid-js";
import { Tabs } from "@kobalte/core";
import { useLocation, unstable_clientOnly } from "solid-start";
import GenericSelect, { TimeSpanMap } from "./generic-select";
import { ArrowDownWideNarrow, TimerReset } from "lucide-solid";
import { CatFilterMap, CurrencyToggleGroup } from "./filter-valmaps";
import { cn } from "~/utils/cn";
import SniperTable from "./sniper-table";
import { TransitionGroup } from "solid-transition-group";
// import TrendTable from "./trend-table";
const TrendTable = unstable_clientOnly(() => import("./trend-table"));
const MintTable = unstable_clientOnly(() => import("./mint-table"));
const tabStyle =
  "bg-transparent border-none [&[data-selected]]:(text-offwhite ) px-[12px]";
export function TableView() {
  const location = useLocation();
  const [ts, setTS] = createSignal<string>("24 Hrs");
  const [cat, setCat] = createSignal<string>("Volume");
  const [currency, setCurrency] = createSignal<"all" | "solana" | "ethereum">(
    "all"
  );
  const [tab, setTab] = createSignal<string>(location.query["#"] ?? "trending");
  //TODO: use something other than map
  const tsVal = () => TimeSpanMap.get(ts())!;
  const catVal = () => CatFilterMap.get(cat())!;
  return (
    <Tabs.Root
      aria-label="Table Nav"
      class="h-[100%] p-0 "
      value={tab()}
      onChange={setTab}
    >
      <div class="flex flex-row space-y-1 pb-1 border-b-base-font-more-receding-color border-b-1 justify-between">
        <Tabs.List class="flex flex-row relative justify-between">
          <div class="text-base-font-more-receding-color inline-flex font-normal text-[20px]">
            <Tabs.Trigger class={tabStyle} value="trending">
              Trending
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="minting">
              Miniting
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="sniper">
              Sniper
            </Tabs.Trigger>
            <Tabs.Indicator class="tabs-indicator absolute transition transition-all transition-250 bg-primary bottom--1 h-0.5" />
          </div>
        </Tabs.List>
        <div class="inline-flex space-x-5">
          <CurrencyToggleGroup val={currency} setVal={setCurrency} />
          <GenericSelect<number>
            valMap={TimeSpanMap}
            val={ts}
            setVal={setTS}
            labelIcon={<TimerReset />}
          />
          <GenericSelect<string>
            valMap={CatFilterMap}
            val={cat}
            setVal={setCat}
            labelIcon={<ArrowDownWideNarrow />}
          />
        </div>
      </div>
      <Tabs.Content class="" value="trending">
        <TrendTable
          ts={tsVal}
          cat={catVal}
          currency={currency}
          fallback={<div>is loading</div>}
        />
      </Tabs.Content>
      <Tabs.Content class="" value="minting">
        <MintTable
          ts={tsVal}
          cat={cat}
          currency={currency}
          fallback={<div>is loading</div>}
        />
      </Tabs.Content>
      <Tabs.Content class="" value="sniper">
        Sniper
        <SniperTable />
      </Tabs.Content>
    </Tabs.Root>
  );
}
