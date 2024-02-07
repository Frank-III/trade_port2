import { createSignal } from "solid-js";
import { Tabs } from "@kobalte/core";
import { useLocation, unstable_clientOnly } from "solid-start";
import { GenericSelect2 } from "../generic-select";
import { ArrowDownWideNarrow, TimerReset } from "lucide-solid";
import { CurrencyToggleGroup, catOptions, tsOptions } from "./filter-valmaps";
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
      class="w-100% mx-auto mb-0 mt-[50px] h-[100%] max-w-[1200px] px-5"
      value={tab()}
      onChange={setTab}
    >
      <div class="border-b-base-font-more-receding-color border-b-1 border-border flex flex-row justify-between space-y-1 pb-1">
        <Tabs.List class="relative flex flex-row justify-between">
          <div class="text-base-font-more-receding-color inline-flex text-[20px] font-normal">
            <Tabs.Trigger class={tabStyle} value="trending">
              Trending
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="minting">
              Miniting
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="sniper">
              Sniper
            </Tabs.Trigger>
            <Tabs.Indicator class="tabs-indicator transition-250 bg-primary absolute bottom--1 h-0.5 transition transition-all " />
          </div>
        </Tabs.List>
        <div class="inline-flex space-x-3">
          <CurrencyToggleGroup />
          <GenericSelect2<number>
            options={tsOptions}
            val={ts}
            setVal={setTS}
            defaultIcon={<TimerReset size={20} class="icon-default" />}
            class="lt-sm:hidden!"
          />

          <GenericSelect2<string>
            options={catOptions}
            val={cat}
            setVal={setCat}
            class="lt-sm:hidden!"
            defaultIcon={<ArrowDownWideNarrow size={20} class="icon-default" />}
          />
        </div>
      </div>
      <Tabs.Content class="h-[100%]" value="trending">
        <TrendTable
          fallback={
            <div class="flex h-[100%] w-full items-center justify-center">
              is loading
            </div>
          }
        />
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
