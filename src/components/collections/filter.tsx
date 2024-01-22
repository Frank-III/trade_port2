import { Collapsible, Slider } from "@kobalte/core";
import {
  type ComponentProps,
  For,
  type JSX,
  type Accessor,
  type Setter,
  Show,
} from "solid-js";
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
  status,
  setStatus,
  filterRarityMin,
  filterRarityMax,
  setFilterRarityMin,
  setFilterRarityMax,
} from "~/components/collections/signals";
import { PocketKnife, Search, Tags } from "lucide-solid";
import { CollectionWithProperties } from "~/libs/fake_data";

const TwowaySlider = (props: {
  title?: string;
  range1: Accessor<number>;
  range2: Accessor<number>;
  range1Setter: Setter<number>;
  range2Setter: Setter<number>;
  maxRange: number;
}) => {
  const thumbStyle =
    "block h-16px top--4px w-16px rounded-full bg-background hover:shadow focus:(shadow outline-none) items-center border-2 border-border focus:(border-primary h-18px w-18px) transition-transform";
  const range1_per = () => (props.range1() / props.maxRange) * 100;
  const range2_per = () => (props.range2() / props.maxRange) * 100;
  return (
    <Slider.Root
      class="select-none relative flex flex-col items-center touch-none px-5 w-full h-10px mt-3 mb-2"
      value={[range1_per(), range2_per()]}
      onChange={(vs) => {
        props.range1Setter((vs[0] * props.maxRange) / 100);
        props.range2Setter((vs[1] * props.maxRange) / 100);
      }}
    >
      <Show when={props.title}>
        <Slider.Label>{props.title}</Slider.Label>
      </Show>
      <Slider.Track class="relative rounded-full w-full bg-[#2b2b2b] h-8px">
        <Slider.Fill class="absolute rounded-full bg-[#414141] h-full" />
        <Slider.Thumb class={thumbStyle}>
          <Slider.Input />
        </Slider.Thumb>
        <Slider.Thumb class={thumbStyle}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
};

// TODO: figure this out: Should I make it a Record<string, {search:"", selected:[]}> or keep it this way?
type filterStore = Record<string, Array<string>>;

interface FilterProps {
  filterStore: filterStore;
  storeSetter: SetStoreFunction<filterStore>;
  collection: CollectionWithProperties;
}
interface FilterItemProps extends ComponentProps<"div"> {
  title: string;
  children: JSX.Element;
  triggerStyles?: string;
}

const triggerIcon = "i-octicon-chevron-down-16 [&[data-expanded]]:rotate-180";
const buttonStyle =
  "bg-background-body hover:bg-background-hover w-full px-3 py-1 text-base font-normal [&[data-expanded]]:bg-background-hover";

const toggleStyle =
  "inline-flex text-base-font-more-receding-color text-base font-normal px-2 py-1 items-center bg-background hover:bg-background-hover rounded-lg";

function FilterItem(props: FilterItemProps) {
  return (
    <Collapsible.Root class="">
      <Collapsible.Trigger
        class={cn(
          buttonStyle,
          "inline-flex items-center justify-between",
          props.triggerStyles
        )}
      >
        <span
          class={
            cn()
            // (minPrice() !== 0 || maxPrice() !== 10000) && "text-primary",
          }
        >
          {props.title}
        </span>
        <div class={triggerIcon} />
      </Collapsible.Trigger>
      <Collapsible.Content class={props.class}>
        {props.children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function Filter(props: FilterProps) {
  const [searchStore, setSearchStore] = createStore<string[]>(
    Object.keys(props.collection.allProperties).map((_) => "")
  );

  return (
    <div class=" border-border pb-40px border-base-font-receding-color relative flex w-[281px] flex-col rounded-lg rounded-r-none border border-border h-[cal(100%-190px)] overflow-auto overflow-x-hidden overflow-y-auto">
      <div class="flex flex-col justify-between px-3 text-offwhite text-base">
        Status
        <div class="flex flex-row p-1">
          <button
            type="button"
            class={cn(toggleStyle, "")}
            onClick={(e) => {
              switch (status()) {
                case "all":
                  setStatus("unlisted");
                  break;
                case "listed":
                  setStatus("all");
                  break;
                case "unlisted":
                  setStatus("all");
              }
            }}
          >
            <Tags
              class={cn(
                "icon-default ",
                (status() === "listed" || status() === "all") && "text-primary"
              )}
            />
            <span class="text-offwhite">Listed</span>
          </button>
          <button
            class={cn(toggleStyle, "")}
            type="button"
            onClick={(e) => {
              switch (status()) {
                case "all":
                  setStatus("listed");
                  break;
                case "listed":
                  setStatus("all");
                  break;
                case "unlisted":
                  setStatus("all");
              }
            }}
          >
            <PocketKnife
              class={cn(
                "icon-default ",
                (status() === "unlisted" || status() === "all") &&
                  "text-primary"
              )}
            />
            <span class="text-offwhite">Unlisted</span>
          </button>
        </div>
      </div>
      <FilterItem title="Price" class="flex flex-col w-full">
        <TwowaySlider
          range1={minPrice}
          range2={maxPrice}
          range1Setter={setMinPrice}
          range2Setter={setMaxPrice}
          maxRange={10000}
        />
        <div class="flex flex-row items-center justify-between px-2 pt-2 text-base">
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
        </div>
      </FilterItem>
      <FilterItem title="Rarity" class="flex flex-col w-full">
        <div class="flex flex-row gap-3 justify-center">
          <button
            type="button"
            class="button-default text-primary text-base font-normal"
          >
            Top 2%
          </button>
          <button
            type="button"
            class="button-default text-rose-7 text-base font-normal"
          >
            Top 10%
          </button>
          <button
            type="button"
            class="button-default text-violet-7 text-sm font-normal"
          >
            Top 20%
          </button>
        </div>
        <TwowaySlider
          range1={filterRarityMin}
          range2={filterRarityMax}
          range1Setter={setFilterRarityMin}
          range2Setter={setFilterRarityMax}
          maxRange={5000}
        />
        <div class="flex flex-row items-center justify-between px-2 pt-2 text-base">
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
        </div>
      </FilterItem>
      <div class="border-t-2 border-border flex flex-col flex-w-full">
        <span class="text-offwhite font-bold text-base text-start px-3">
          Attributes
        </span>
        <div class="flex flex-col h-full w-full">
          <div class="flex flex-row w-full border-b-2 border-border items-center justify-between px-3 py-1">
            <div class="flex flex-[3_3_1] text-base font-normal">Type</div>
            <div class="flex flex-[1_1_0] justify-end text-base font-normal">
              Rarity
            </div>
          </div>
          <div class="h-[calc(100%-32px)] pb-20 overflow-y-scroll overflow-x-hidden">
            <For each={Object.entries(props.collection.allProperties)}>
              {(item, idx) => {
                return (
                  <FilterItem
                    title={item[0]}
                    class="w-full h-258px overflow-y-scroll overflow-x-hidden"
                    triggerStyles={cn(
                      idx() === 0 && "pt-0",
                      props.filterStore[item[0]].length > 0 && "text-primary"
                    )}
                  >
                    <div class="button-default w-full ml-15px lt-smm:ml-0 gap-0 text-sm font-normal ">
                      <Search class="rounded-full" />
                      <input
                        class="text-offwhite w-full min-w-0 bg-transparent text-base font-light focus:outline-none "
                        placeholder="Search"
                        value={searchStore[idx()]}
                        onInput={(e) => {
                          setSearchStore(idx(), e.currentTarget.value);
                        }}
                      />
                    </div>
                    {/* TODO: Filter Based on the Search Query */}
                    <div class="w-full flex flex-col px-3">
                      <For each={Object.entries(item[1])}>
                        {([key, val]) => (
                          <div class="flex flex-row justify-between items-center ">
                            <div class="inline-flex text-base font-normal">
                              <input
                                type="checkbox"
                                checked={props.filterStore[item[0]].includes(
                                  key
                                )}
                                onClick={(e) => {
                                  // console.log(props.filterStore);
                                  if (e.currentTarget.checked) {
                                    props.storeSetter(item[0], (l) => [
                                      ...l,
                                      key,
                                    ]);
                                  } else {
                                    props.storeSetter(item[0], (l) =>
                                      l.filter((i) => i !== key)
                                    );
                                  }
                                }}
                              />
                              <span class="text-neutral-300 overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal">
                                {key}
                              </span>
                            </div>
                            <span class="text-neutral-300 text-base font-normal">
                              {val}
                            </span>
                          </div>
                        )}
                      </For>
                    </div>
                  </FilterItem>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
