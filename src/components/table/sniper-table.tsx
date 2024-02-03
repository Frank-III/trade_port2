import { ChevronDown, ChevronUp, Search } from "lucide-solid";
import { SniperState, TrendingTableRow } from "./types";
import { createSignal, For } from "solid-js";
import { cn } from "~/utils/cn";
import { Collapsible } from "@kobalte/core";
import { createStore } from "solid-js/store";

function TableRow(props: { item: any }) {}

export default function SniperTable() {
  // should probably use a solid store
  // const [rarityOpen, setRarityOpen] = createSignal<boolean>(false);
  // const [collection, setCollection] = createSignal<string>("all");

  const [sniperState, setSniperState] = createStore<SniperState>({
    rarityOpen: false,
    collection: "all",
    min: 1,
    max: 50000,
    search: "",
  });
  const buttonStyle =
    "bg-background-body hover:bg-background-hover w-full px-3 py-1 text-base font-normal";
  return (
    <div class="mt-10px flex h-[calc(100vh-90px)] w-full flex-col flex-wrap">
      <div class="border-border pb-40px border-base-font-receding-color relative flex h-[cal(100%-80px)] w-[281px] flex-col overflow-auto overflow-x-hidden rounded-lg border ">
        <div class="text-offwhite inline-flex justify-between px-3 text-base">
          Collections
          <button
            class={cn(
              "text-primary bg-transparent text-base font-normal",
              sniperState.collection === "all" && "hidden",
            )}
            type="button"
          >
            Reset
          </button>
        </div>
        <div class="button-default m-2">
          <Search class="text-primary ml-0" />
          <input
            class="text-offwhite w-80% hover:bg-background-hover bg-transparent text-base font-light focus:outline-none"
            placeholder="Search"
            value={sniperState.search}
            onChange={(e) => setSniperState("search", e.target.value)}
          />
        </div>
        <div class="border-y-1 text-md border-border-color inline-flex w-full justify-between px-3 text-lg font-normal">
          <span class="text-base-font-more-receding-color">Collection</span>
          <span class="text-base-font-more-receding-color">Floor</span>
        </div>
        <div class="flex flex-col">
          <button
            class={cn(buttonStyle, "bg-background-hover flex justify-start")}
            type="button"
          >
            All Collections
          </button>
        </div>
        <Collapsible.Root
          open={sniperState.rarityOpen}
          onOpenChange={() => {
            setSniperState("rarityOpen", !sniperState.rarityOpen);
          }}
        >
          <Collapsible.Trigger
            class={cn(
              buttonStyle,
              "inline-flex items-center justify-between py-1 ",
            )}
          >
            <span>Rarity</span>
            {sniperState.rarityOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </Collapsible.Trigger>
          <Collapsible.Content class="flex flex-row items-center justify-between px-2 pt-2 text-base">
            <div class="inline-flex space-x-2 text-base font-normal">
              <span>Min</span>
              <input
                class="button-default h-[30px] w-[70px]"
                value={sniperState.min}
                onChange={(e) => setSniperState("min", Number(e.target.value))}
              />
            </div>
            <div class="inline-flex space-x-2 text-base font-normal">
              <span>Max</span>
              <input
                class="button-default h-[30px] w-[70px]"
                value={sniperState.max}
                onChange={(e) => setSniperState("max", Number(e.target.value))}
              />
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
      <div class="gap-40px flex flex-col"></div>
    </div>
  );
}
