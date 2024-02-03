import { Collapsible, Slider } from "@kobalte/core";
import {
  type ComponentProps,
  For,
  type JSX,
  type Accessor,
  type Setter,
  Show,
  createMemo,
  useContext,
} from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { cn } from "~/utils/cn";
import {
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
import { type CollectionWithProperties } from "~/server/trpc/router/_app";
import "./filter.css";
import { StoreContext } from "~/routes/next";

export function TwowaySlider(props: {
  title?: string;
  range1: Accessor<number>;
  range2: Accessor<number>;
  range1Setter: Setter<number>;
  range2Setter: Setter<number>;
  maxRange: number;
}) {
  const thumbStyle =
    "block h-16px top--4px w-16px rounded-full bg-background hover:shadow focus:(shadow outline-none) items-center border-2 border-border focus:(border-primary h-18px w-18px) transition-transform";
  const range1_per = () => (props.range1() / props.maxRange) * 100;
  const range2_per = () => (props.range2() / props.maxRange) * 100;
  return (
    <Slider.Root
      class="h-10px relative mb-2 mt-3 flex w-full touch-none select-none flex-col items-center px-5"
      value={[range1_per(), range2_per()]}
      onChange={(vs) => {
        props.range1Setter((vs[0] * props.maxRange) / 100);
        props.range2Setter((vs[1] * props.maxRange) / 100);
      }}
    >
      <Show when={props.title}>
        <Slider.Label>{props.title}</Slider.Label>
      </Show>
      <Slider.Track class="h-8px relative w-full rounded-full bg-[#2b2b2b]">
        <Slider.Fill class="absolute h-full rounded-full bg-[#414141]" />
        <Slider.Thumb class={thumbStyle}>
          <Slider.Input />
        </Slider.Thumb>
        <Slider.Thumb class={thumbStyle}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}

// TODO: figure this out: Should I make it a Record<string, {search:"", selected:[]}> or keep it this way?
interface FilterProps {
  collection: CollectionWithProperties;
}
interface FilterItemProps extends ComponentProps<"div"> {
  title: string;
  children: JSX.Element;
  rootStyles?: string;
  triggerStyles?: string;
  titleStyles?: string;
}

const triggerIcon = "i-octicon-chevron-down-16 [&[data-expanded]]:rotate-180";
const buttonStyle =
  "bg-background-body hover:bg-background-hover w-full px-3 py-1 text-base font-normal [&[data-expanded]]:bg-background-hover";

const toggleStyle =
  "inline-flex text-base-font-more-receding-color text-base font-normal px-2 py-1 items-center bg-background hover:bg-background-hover rounded-lg";

function FilterItem(props: FilterItemProps) {
  return (
    <Collapsible.Root class={props.rootStyles}>
      <Collapsible.Trigger
        class={cn(
          buttonStyle,
          "collapse-trigger inline-flex items-center justify-between",
          props.triggerStyles,
        )}
      >
        <span class={`text-offwhite ${props.titleStyles} text-15px`}>
          {props.title}
        </span>
        {/* TODO: fix this using normal css*/}
        <div class={`collapse-icon ${triggerIcon}`} />
      </Collapsible.Trigger>
      <Collapsible.Content class={`collapsible__content ${props.class}`}>
        {props.children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default function Filter(props: FilterProps) {
  const { filter, filterSetter } = useContext(StoreContext);

  const [searchStore, setSearchStore] = createStore<string[]>(
    props.collection?.attributes!.map(() => ""),
  );

  const priceRangeChanged = createMemo(
    () => minPrice() !== 0 || maxPrice() !== 10000,
  );
  const rarityRangeChanged = createMemo(
    () => filterRarityMin() > 1 || filterRarityMax() < 5000,
  );
  const statusChanged = createMemo(() => status() !== "all");
  const filterChanged = createMemo(() =>
    Object.values(filter).reduce((acc, curr) => acc || curr.length > 0, false),
  );

  return (
    <div class="pb-40px border-border w-258px transition-width scrollbar-hide relative flex h-[cal(100%-190px)] flex-col overflow-auto overflow-y-auto overflow-x-hidden rounded-lg rounded-r-none border duration-200">
      <div class="flex w-full flex-col justify-between">
        <div class="text-offwhite inline-flex w-full justify-between px-3 text-base">
          Status
          <Show
            when={
              statusChanged() || priceRangeChanged() || rarityRangeChanged()
            }
          >
            <button
              type="button"
              class="text-primary bg-transparent font-normal"
              onClick={() => {
                setStatus("all");
                setMinPrice(0);
                setMaxPrice(10000);
                setFilterRarityMin(1);
                setFilterRarityMax(5000);
              }}
            >
              Reset
            </button>
          </Show>
        </div>
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
                (status() === "listed" || status() === "all") && "text-primary",
              )}
            />
            <span class="text-offwhite text-sm">Listed</span>
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
                "icon-default",
                (status() === "unlisted" || status() === "all") &&
                  "text-primary ",
              )}
            />
            <span class="text-offwhite text-sm">Unlisted</span>
          </button>
        </div>
      </div>
      <FilterItem
        title="Price"
        class="flex w-full flex-col"
        titleStyles={priceRangeChanged() ? "text-primary" : ""}
      >
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
      <FilterItem
        title="Rarity"
        class="my-2 flex w-full flex-col"
        titleStyles={rarityRangeChanged() ? "text-primary" : ""}
        rootStyles="pb-10px"
      >
        <div class="flex flex-row justify-center gap-3">
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
              value={filterRarityMin()}
              onChange={(e) => setFilterRarityMin(Number(e.target.value))}
            />
          </div>
          <div class="inline-flex space-x-2 text-base font-normal">
            <span>Max</span>
            <input
              class="button-default h-[30px] w-[70px]"
              value={filterRarityMax()}
              onChange={(e) => setFilterRarityMax(Number(e.target.value))}
            />
          </div>
        </div>
      </FilterItem>
      <div class="border-border scrollbar-hide flex h-full w-full flex-col border-t-2">
        <div class="inline-flex w-full justify-between px-3">
          <span class="text-offwhite text-start text-base font-bold ">
            Attributes
          </span>
          <Show when={filterChanged()}>
            <button
              type="button"
              class="text-primary bg-transparent text-base font-normal"
              onClick={() => {
                filterSetter((l) =>
                  Object.keys(l).reduce(
                    (acc: Record<string, number[]>, curr) => {
                      acc[curr] = [];
                      return acc;
                    },
                    {},
                  ),
                );
              }}
            >
              Reset
            </button>
          </Show>
        </div>
        <div class="flex h-full w-full flex-col">
          <div class="border-border flex w-full flex-row items-center justify-between border-b-2 px-3 py-1">
            <div class="flex flex-[3_3_1] text-base font-normal">Type</div>
            <div class="flex flex-[1_1_0] justify-end text-base font-normal">
              Rarity
            </div>
          </div>
          <div class="scrollbar-hide h-[calc(100%-34px)] overflow-x-hidden pb-20">
            <For each={props.collection?.attributes!}>
              {(item, idx) => {
                return (
                  <FilterItem
                    title={item.name}
                    class="h-258px w-full overflow-x-hidden overflow-y-scroll"
                    triggerStyles={idx() === 0 ? "pt-0" : ""}
                    titleStyles={
                      filter[item.id].length > 0 ? "text-primary" : ""
                    }
                  >
                    <div class="button-default lt-smm:ml-0 h-1.8rem mx-3 mt-1 gap-0 text-sm font-normal">
                      <Search class="text-primary rounded-full" />
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
                    <div class="flex w-full flex-col px-3">
                      <For each={item.kinds}>
                        {(i, idx_) => (
                          <div class="flex flex-row items-center justify-between px-3">
                            <div class="inline-flex items-center space-x-2 text-base font-normal">
                              {/* TODO: figure out a way to make this input a comb of input and label */}
                              <input
                                type="checkbox"
                                // should use id instead of name, make query easier
                                checked={filter[item.id].includes(i.id)}
                                onClick={(e) => {
                                  // console.log(props.filterStore);
                                  if (e.currentTarget.checked) {
                                    filterSetter(item.id, (l) => [...l, i.id]);
                                  } else {
                                    // why I need this
                                    filterSetter(item.id, (l: number[]) =>
                                      l.filter((i_this) => i_this !== i.id),
                                    );
                                  }
                                }}
                              />
                              <span class="overflow-hidden text-ellipsis whitespace-nowrap text-base font-light text-neutral-400">
                                {i.name}
                              </span>
                            </div>
                            <span class="text-base font-normal text-neutral-300">
                              {i.value}
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
