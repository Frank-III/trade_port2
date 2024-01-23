import { Tabs } from "@kobalte/core";
import { createSignal } from "solid-js";

const tabStyle =
  "bg-transparent  hover:(text-base-font-receding-color) [&[data-selected]]:(text-offwhite ) px-[12px] ";
export function CollectionItemsView() {
  const [tab, setTab] = createSignal<string>();
  return (
    <Tabs.Root
      aria-label="Table Nav"
      class="h-[60vh-78px] lt-lg:h-[100vh-80px] "
      value={tab()}
      onChange={setTab}
    >
      <div class="flex flex-row space-y-1 pb-1 border-b-base-font-more-receding-color border-b-1 justify-between border-border">
        <Tabs.List class="flex flex-row relative justify-between">
          <div class="text-base-font-more-receding-color inline-flex font-normal text-[20px]">
            <Tabs.Trigger class={tabStyle} value="items">
              Items
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="bids">
              Bids
            </Tabs.Trigger>
            <Tabs.Trigger class={tabStyle} value="holders">
              Holders
            </Tabs.Trigger>
            <Tabs.Indicator class="tabs-indicator absolute transition transition-all transition-250 bg-primary bottom--1 h-0.5 " />
          </div>
        </Tabs.List>
        <div class="inline-flex space-x-3"></div>
      </div>
      <Tabs.Content class="" value="items"></Tabs.Content>
      <Tabs.Content class="" value="bids"></Tabs.Content>
      <Tabs.Content class="" value="holders"></Tabs.Content>
    </Tabs.Root>
  );
}
