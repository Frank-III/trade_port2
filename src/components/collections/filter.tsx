import { Collapsible } from "@kobalte/core";
import { type ComponentProps, For, type JSX } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { cn } from "~/utils/cn";
import { trpc } from "~/utils/trpc";

import {
  filterSearch,
  setFilterListed,
  setFilterSearch,
  filterListed,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
} from "~/components/collections/signals";

type filterStore = Record<string, Array<string>>;

interface FilterProps {
  filterStore: filterStore;
  storeSetter: SetStoreFunction<filterStore>;
}
interface FilterItemProps extends ComponentProps<"div"> {
  title: string;
  children: JSX.Element;
}

const triggerIcon = "i-octicon-chevron-down-16 hover:rotate-180";
const buttonStyle =
  "bg-background-body hover:bg-background-hover w-full px-3 py-1 text-base font-normal";
function FilterItem(props: FilterItemProps) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger
        class={cn(
          buttonStyle,
          "inline-flex items-center justify-between py-1 "
        )}
      >
        <span>{props.title}</span>
        <div class={triggerIcon} />
      </Collapsible.Trigger>
      <Collapsible.Content
        class={cn(
          "flex flex-row items-center justify-between px-2 pt-2 text-base",
          props.class
        )}
      >
        {props.children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function Filter(props: FilterProps) {
  const triggerIcon = "i-octicon-chevron-down-16 hover:rotate-180";
  const buttonStyle =
    "bg-background-body hover:bg-background-hover w-full px-3 py-1 text-base font-normal";
  return (
    <div class="border-border pb-40px border-base-font-receding-color relative flex h-[cal(100%-80px)] w-[281px] flex-col overflow-auto overflow-x-hidden rounded-lg border ">
      <div class="inline-flex justify-between px-3 text-offwhite text-base">
        Status
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
      <FilterItem title="Price">
        <div class="inline-flex space-x-2 text-base font-normal">
          <span>Min</span>
          <input
            class="button-default h-[30px] w-[70px]"
            value={minPrice()}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </div>
        <div class="inline-flex space-x-2 text-base font-normal">
          <span>Max</span>
          <input
            class="button-default h-[30px] w-[70px]"
            value={maxPrice()}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </FilterItem>
    </div>
  );
}
