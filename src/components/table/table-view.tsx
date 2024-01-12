import { createSignal, For } from "solid-js";
import { Tabs } from "@kobalte/core";
import { useLocation, unstable_clientOnly } from "solid-start";
import GenericSelect, { TimeSpanMap } from "./generic-select";
import { ArrowDownWideNarrow, TimerReset } from "lucide-solid";
import { CatFilterMap, CurrencyToggleGroup } from "./filter-valmaps";
// import { cn } from "~/utils/cn";
import SniperTable from "./sniper-table";
import { cat, setCat, setTS, ts } from "./signals";
// import TrendTable from "./trend-table";
const TrendTable = unstable_clientOnly(() => import("./trend-table"));
const MintTable = unstable_clientOnly(() => import("./mint-table"));
// outline-offset-6 border-b-1 border-primary
const tabStyle =
  "bg-transparent  hover:(text-base-font-receding-color) [&[data-selected]]:(text-offwhite ) px-[12px] ";

export function TableView() {
  const location = useLocation();
  const [tab, setTab] = createSignal<string>(location.query["#"] ?? "trending");
  //TODO: use something other than map
  return (
    <Tabs.Root
      aria-label="Table Nav"
      class="h-[100%] px-5 mx-auto mt-[50px] mb-0 max-w-[1200px] w-100%"
      value={tab()}
      onChange={setTab}
    >
      <div class="flex flex-row space-y-1 pb-1 border-b-base-font-more-receding-color border-b-1 justify-between border-border">
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
            <Tabs.Indicator class="tabs-indicator absolute transition transition-all transition-250 bg-primary bottom--1 h-0.5 " />
          </div>
        </Tabs.List>
        <div class="inline-flex space-x-3">
          <CurrencyToggleGroup />
          <GenericSelect<number>
            valMap={TimeSpanMap}
            val={ts}
            setVal={setTS}
            class="lt-sm:(hidden!) "
            labelIcon={<TimerReset size={20} class="icon-default" />}
          />
          <GenericSelect<string>
            valMap={CatFilterMap}
            val={cat}
            setVal={setCat}
            class="lt-sm:hidden!"
            labelIcon={<ArrowDownWideNarrow size={20} class="icon-default" />}
          />
        </div>
      </div>
      <Tabs.Content class="" value="trending">
        <TrendTable fallback={<div>is loading</div>} />
      </Tabs.Content>
      <Tabs.Content class="" value="minting">
        <MintTable fallback={<div>is loading</div>} />
      </Tabs.Content>
      <Tabs.Content class="" value="sniper">
        <SniperTable />
      </Tabs.Content>
    </Tabs.Root>
  );
}
