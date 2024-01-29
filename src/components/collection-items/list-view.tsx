import { Skeleton } from "@kobalte/core";
import { For } from "solid-js";
import { type CollectionItemWithProperties } from "~/server/trpc/router/_app";

const headerStyle = "flex-[0.8_1_0] flex items-center font-normal text-base";
export const CollectionItemListHeader = () => {
  return (
    <div class="h-32px border-1 border-border pl-27px flex items-center justify-between border-b">
      <div class={`${headerStyle} flex-[2_1_0]`}>ITEM</div>
      <div class={headerStyle}>RARITY</div>
      <div class={headerStyle}>PRICE</div>
      <div class={headerStyle}>TOP BID</div>
      <div class={`${headerStyle} flex-[1_1_0]`}>OWNER</div>
    </div>
  );
};

export const ItemsListSkeleton = (props: { limits: number }) => {
  return (
    <For each={Array.from({ length: props.limits })}>
      {() => (
        <div class="h-32px border-1 border-border pl-27px flex items-center justify-between border-b">
          <div class={`${headerStyle} flex-[2_1_0]`}>
            <Skeleton.Root class="skeleton" radius={5}>
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
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class={headerStyle}>
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class={headerStyle}>
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class={headerStyle}>
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class={`${headerStyle} flex-[1_1_0]`}>
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
        </div>
      )}
    </For>
  );
};

export function CollectionItemListView(props: {
  item: CollectionItemWithProperties;
}) {
  return (
    <div class="h-32px border-1 border-border pl-27px flex items-center justify-between border-b">
      <div class={`${headerStyle} flex-[2_1_0]`}>
        <Skeleton.Root class="skeleton" radius={5}>
          <div class="flex flex-row items-center space-x-3">
            <img
              class="h-[42px] w-[42px] rounded-full"
              alt="nft collection avatar"
              src={props.item.image || ""}
            />
            <div class="text-table">{props.item.name}</div>
          </div>
        </Skeleton.Root>
      </div>
      <div class={headerStyle}>
        <Skeleton.Root class="skeleton" radius={5}>
          <div class="text-table">{props.item.rarity}</div>
        </Skeleton.Root>
      </div>
      <div class={headerStyle}>
        <Skeleton.Root class="skeleton" radius={5}>
          <div class="text-table">{props.item.price}</div>
        </Skeleton.Root>
      </div>
      <div class={headerStyle}>
        <Skeleton.Root class="skeleton" radius={5}>
          <div class="text-table">{props.item.topBid}</div>
        </Skeleton.Root>
      </div>
      <div class={headerStyle}>
        <Skeleton.Root class="skeleton" radius={5}>
          <div class="text-table">{props.item.owner}</div>
        </Skeleton.Root>
      </div>
      <div class={`${headerStyle} flex-[1_1_0]`}>
        <Skeleton.Root class="skeleton" radius={5}>
          <div class="text-table">{props.item.lastAction}</div>
        </Skeleton.Root>
      </div>
    </div>
  );
}
