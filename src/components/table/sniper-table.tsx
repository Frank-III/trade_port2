import { ChevronDown, ChevronUp, Search } from "lucide-solid";
import { SniperState, TableProps, TrendingTableRow } from "./types";
import { createSignal, For } from "solid-js";
import { cn } from "~/utils/cn";
import { Collapsible } from "@kobalte/core";
import { createStore } from "solid-js/store";

function TableRow(props: { item: ListTableRow }) {}

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
    <div class="h-[calc(100vh-90px)] mt-10px flex flex-col flex-wrap w-full">
      <div class="border-border pb-40px border-base-font-receding-color relative flex h-[cal(100%-80px)] w-[281px] flex-col overflow-auto overflow-x-hidden rounded-lg border ">
        <div class="inline-flex justify-between px-3 text-offwhite text-base">
          Collections
          <button
            class={cn(
              "text-primary bg-transparent text-base font-normal",
              sniperState.collection === "all" && "hidden"
            )}
            type="button"
          >
            Reset
          </button>
        </div>
        <div class="button-default m-2">
          <Search class="text-primary ml-0" />
          <input
            class="text-offwhite w-80% bg-transparent text-base font-light focus:outline-none hover:bg-background-hover"
            placeholder="Search"
            value={sniperState.search}
            onChange={(e) => setSniperState("search", e.target.value)}
          />
        </div>
        <div class="border-y-1 text-md inline-flex w-full justify-between px-3 text-lg font-normal border-border-color">
          <span class="text-base-font-more-receding-color">Collection</span>
          <span class="text-base-font-more-receding-color">Floor</span>
        </div>
        <div class="flex flex-col">
          <button
            class={cn(buttonStyle, "flex justify-start bg-background-hover")}
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
              "inline-flex items-center justify-between py-1 "
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
      <div class="flex flex-col gap-40px"></div>
    </div>
  );
}
