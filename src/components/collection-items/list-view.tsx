import { Skeleton } from "@kobalte/core";
import { For } from "solid-js";
import { type CollectionItemWithProperties } from "~/server/trpc/router/_app";

const headerStyle =
	"flex flex-[0.8_1_0%] items-center font-normal text-center text-base";
export const CollectionItemListHeader = () => {
	return (
		<div class="flex h-32px border-border pl-27px items-center justify-between border-b">
			<div class={`${headerStyle} flex-[2_1_0%]`}>ITEM</div>
			<div class={headerStyle}>RARITY</div>
			<div class={headerStyle}>PRICE</div>
			<div class={headerStyle}>TOP BID</div>
			<div class={`${headerStyle} flex-[1_1_0%]`}>OWNER</div>
		</div>
	);
};

export function CollectionItemListView(props: {
	item: CollectionItemWithProperties;
}) {
	return (
		<div class="flex border-b border-border pl-27px items-center justify-between py-2">
			<div class={`${headerStyle} flex-[2_1_0%]`}>
				<div class="flex flex-row items-center space-x-3 text-table">
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

export const IntantSellListView = () => {
	return (
		<div class="flex justify-between items-center pl-27px">
			<div class="flex gap-3px items-center py-3px">
				<div class="button-primary h-auto p-8px">
					<div class="i-tabler-clock-dollar text-24px text-primary" />
				</div>
				<span class="text-lg font-normal">Instant Sell</span>
			</div>
			<div class="">250</div>
			<div class="flex gap-2px">
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

export const ItemsListSkeleton = (props: { limits: number }) => {
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
