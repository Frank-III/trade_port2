import { Skeleton } from "@kobalte/core";
import { For } from "solid-js";
import { type CollectionItemWithProperties } from "~/server/trpc/router/_app";
import { cn } from "~/utils/cn";

const headerStyle =
  "flex flex-[0.8_1_0%] items-center font-normal text-center text-base";

export const ItemsSmGridSkeleton = (props: {
  limits: number;
  large: boolean;
}) => {
  const extraStyles = { width: "60%" };
  return (
    <For each={Array.from({ length: props.limits })}>
      {() => (
        <div class="border-1 border-border pl-27px flex items-center justify-between border-b">
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

// export const InstantSellGridView = (props: { large: boolean }) => {
// 	return (
// 		<div class="flex flex-col border border-border items-center justify-center gap-8px hover:border-primary cursor-pointer relative">
// 			<div class="flex gap-3px items-center py-3px">
// 				<div class="button-primary h-auto p-8px rounded-full">
// 					<div class="i-tabler-clock-dollar text-24px text-primary" />
// 				</div>
// 				<span class="text-lg font-normal">Instant Sell</span>
// 			</div>
// 			<div class="">250</div>
// 			<button class="button-primary text-base font-normal" type="button">
// 				Sell Now
// 			</button>
// 			<button class="button-secondary text-base font-normal" type="button">
// 				Make Offer
// 			</button>
// 		</div>
// 	);
// };

export const InstantSellGridView = (props: { large: boolean }) => {
  return (
    <div class="border-border transition-border-color ease relative cursor-pointer border duration-300">
      <div
        class="top-adjustable-container min-w-140px aspect-square"
        classList={{
          "min-w-245px max-w-365px": props.large,
        }}
      />
      <div
        class="buttom-fixed-container h-93.5px"
        classList={{
          "h-106px": props.large,
        }}
      />
      <div
        class="card-content top-50% left-50% absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        classList={{
          "w-140px": !props.large,
        }}
      >
        <div class="button-primary p-8px h-auto rounded-full">
          <div class="i-tabler-clock-dollar text-40px text-primary" />
        </div>
        <span class="text-lg font-normal">Instant Sell</span>
      </div>
      <div class="text-offwhite text-base font-normal">250</div>
      <div class="gap-10px mt-10px flex flex-col items-center">
        <button class="button-primary text-base font-normal" type="button">
          Sell Now
        </button>
        <button class="button-secondary text-base font-normal" type="button">
          Make Offer
        </button>
      </div>
    </div>
  );
};
export function CollectionItemsGridView(props: {
  item: CollectionItemWithProperties;
  large: boolean;
}) {
  return (
    <div class="border-border pl-27px flex items-center justify-between border-b border-b py-2">
      <div class={`${headerStyle} flex-[2_1_0%]`}>
        <div class="text-table flex flex-row items-center space-x-3">
          <img
            class="h-[42px] w-[42px] rounded-lg"
            alt="nft item avatar"
            src={props.item.image || ""}
          />
          <span class="text-table">{props.item.name}</span>
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
        <div class="text-table">{props.item.lastAction}</div>
      </div>
    </div>
  );
}
