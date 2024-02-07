import { Skeleton } from "@kobalte/core";
import { For } from "solid-js";
import { type CollectionItemWithProperties } from "~/server/trpc/router/_app";
import "~/components/table/skeleton.css";

const headerStyle =
  "flex flex-[0.8_1_0%] items-center font-normal text-center text-base";
export const CollectionItemListHeader = () => {
  return (
    <div class="h-32px border-border pl-27px flex items-center justify-between border-b">
      <div class={`${headerStyle} flex-[2_1_0%]`}>ITEM</div>
      <div class={headerStyle}>RARITY</div>
      <div class={headerStyle}>PRICE</div>
      <div class={headerStyle}>TOP BID</div>
      <div class={headerStyle}>OWNER</div>
      <div class={`${headerStyle} flex-[1_1_0%]`}>LAST ACTION</div>
    </div>
  );
};

export function CollectionItemListView(props: {
  item: CollectionItemWithProperties;
}) {
  return (
    <div class="border-border pl-27px hover:bg-dark-gray group flex items-center justify-between py-2">
      <div class={`${headerStyle} flex-[2_1_0%]`}>
        <div class="text-table flex flex-row items-center space-x-3">
          <img
            class="hover:(border-primary border-1) h-[42px] w-[42px] rounded-lg "
            alt="nft item avatar"
            src={props.item.image || ""}
          />
          <span class="text-table hover:text-primary">{props.item.name}</span>
        </div>
      </div>
      <div class={headerStyle}>
        <div class="text-table">{props.item.rarity}</div>
      </div>
      <div class={headerStyle}>
        <div class="text-table">{props.item.price}</div>
      </div>
      <div class={headerStyle}>
        <div class="text-table">{props.item.topBid}</div>
      </div>
      <div class={headerStyle}>
        <div class="text-table truncate pr-4">{props.item.owner}</div>
      </div>
      <div class={`${headerStyle} flex-[1_1_0%]`}>
        <div class="text-table group-hover:hidden">{props.item.lastAction}</div>
        <div class="space-x-1px hidden flex-row items-center justify-center group-hover:flex">
          <button class="button-primary h-auto text-sm font-normal">Buy</button>
          <button class="button-secondary h-auto text-sm font-normal">
            Bid
          </button>
        </div>
      </div>
    </div>
  );
}

export const IntantSellListView = () => {
  return (
    <div class="pl-27px flex items-center justify-between">
      <div class="gap-3px py-3px flex items-center">
        <div class="button-primary p-8px h-auto">
          <div class="i-tabler-clock-dollar text-24px text-primary" />
        </div>
        <span class="text-lg font-normal">Instant Sell</span>
      </div>
      <div class="text-baase font-normal">250</div>
      <div class="gap-2px flex">
        <button
          class="button-primary py-2px h-auto text-base font-normal"
          type="button"
        >
          Sell Now
        </button>
        <button
          class="button-secondary py-2px h-auto text-base font-normal "
          type="button"
        >
          Make Offer
        </button>
      </div>
    </div>
  );
};

export const ItemsListSkeleton = (props: { limits: number }) => {
  const extraStyles = { width: "60%" };
  return (
    <For each={Array.from({ length: props.limits })}>
      {() => (
        <div class="border-1 border-border pl-27px flex items-center justify-between ">
          <div class={`${headerStyle} flex-[2_1_0%]`}>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="flex flex-row items-center space-x-3">
                <img
                  class="h-[42px] w-[42px] rounded-full"
                  alt="nft collection avatar"
                />
                <div class="text-table">name</div>
              </div>
            </Skeleton.Root>
          </div>
          <div class={headerStyle}>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class={headerStyle}>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class={headerStyle}>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class={headerStyle}>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table truncate">
                6ac193e8-2126-4b3f-8711-6d746bb9beff
              </div>
            </Skeleton.Root>
          </div>
          <div class={`${headerStyle} flex-[1_1_0%]`}>
            <Skeleton.Root class="skeleton" radius={5} style={extraStyles}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
        </div>
      )}
    </For>
  );
};
