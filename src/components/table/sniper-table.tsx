import { ChevronDown, ChevronUp, Search } from "lucide-solid";
import { TableProps, TrendingTableRow} from "./types";
import { createSignal, For } from "solid-js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/generic-table/table-style";
import { cn } from "~/utils/cn";
import { Collapsible } from "@kobalte/core";




export default function SniperTable() {
  const [rarityOpen, setRarityOpen] = createSignal<boolean>(false);
  const buttonStyle =
    "bg-background-body hover:bg-background-hover w-full px-3 py-2 text-base font-normal";
  return (
    <div class="border-border pb-40px border-base-font-receding-color relative flex h-[cal(100%-80px)] w-[281px] flex-col overflow-auto overflow-x-hidden rounded-lg border">
      <div class="inline-flex justify-between px-3">
        Collections
        <button class="text-primary bg-transparent text-base font-normal">
          Reset
        </button>
      </div>
      <div class="button-default w-full p-2">
        <Search class="text-primary ml-0" />
        <input
          class="text-offwhite w-full bg-transparent text-base font-light focus:outline-none"
          placeholder="Search"
        />
      </div>
      <div class="border-y-1 text-md inline-flex w-full justify-between px-3 text-lg font-normal">
        <span class="text-base-font-more-receding-color">Collection</span>
        <span class="text-base-font-more-receding-color">Floor</span>
      </div>
        <button class={cn(buttonStyle, "flex justify-start")}>
          All Collections
      </button>
      <Collapsible.Root
        open={rarityOpen()}
        onOpenChange={() => {
          setRarityOpen(!rarityOpen());
        }}
      >
        <Collapsible.Trigger
          class={cn(
            buttonStyle,
            "inline-flex items-center justify-between py-1",
          )}
        >
          <span>Rarity</span>
          {rarityOpen() ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Collapsible.Trigger>
        <Collapsible.Content class="flex flex-row items-center justify-between px-2 pt-2 text-base">
          <div class="inline-flex space-x-2">
            <span>Min</span>
            <input class="button-default h-[30px] w-[70px]" />
          </div>
          <div class="inline-flex space-x-2">
            <span>Max</span>
            <input class="button-default h-[30px] w-[70px]" />
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}