import { Collapsible, Slider } from "@kobalte/core";
import {
	type ComponentProps,
	For,
	type JSX,
	type Accessor,
	type Setter,
	Show,
} from "solid-js";
import { type SetStoreFunction } from "solid-js/store";
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

type filterStore = Record<string, Array<string>>;

interface FilterProps {
	filterStore: filterStore;
	storeSetter: SetStoreFunction<filterStore>;
}
interface FilterItemProps extends ComponentProps<"div"> {
	title: string;
	children: JSX.Element;
}

const triggerIcon = "i-octicon-chevron-down-16 [&[data-expanded]]:rotate-180";
const buttonStyle =
	"bg-background-body hover:bg-background-hover w-full px-3 py-1 text-base font-normal";

const toggleStyle =
	"inline-flex text-base-font-more-receding-color text-base font-normal px-2 py-1 items-center bg-background hover:bg-background-hover rounded-lg";

function FilterItem(props: FilterItemProps) {
	return (
		<Collapsible.Root>
			<Collapsible.Trigger
				class={cn(
					buttonStyle,
					"inline-flex items-center justify-between py-1 ",
				)}
			>
				<span
					class={cn(
						// (minPrice() !== 0 || maxPrice() !== 10000) && "text-primary",
					)}
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
	//TODO: should make another query here, to fetch the percentage of each properties

	return (
		<div class=" border-border pb-40px border-base-font-receding-color relative flex h-[cal(100%-80px)] w-[281px] flex-col overflow-auto overflow-x-hidden rounded-lg border border-border">
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
								(status() === "listed" || status() === "all") && "text-primary",
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
									"text-primary",
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
				<div class="flex flex-row px-5 space-x-3">
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
				<span class="text-offwhite font-bold text-base text-start">
					Attributes
				</span>
				<div class="flex flex-col h-full w-full">
					<div class="flex flex-row w-full border-b-2 border-border items-center">
						<div class="flex flex-[3_3_1]">Type</div>
						<div class="flex flex-[1_1_0]">Rarity</div>
					</div>
					<div class="h-[calc(100%-32px)] pb-20 overflow-y-scroll overflow-x-hidden">
						<For each={Object.entries(props.filterStore)}>
							{(item, idx) => {
								return (
									<FilterItem
										title={item[0]}
										class="w-full h-258px overflow-y-scroll"
									>
										<div class="button-default w-200px ml-15px lt-smm:ml-0 gap-0 text-sm font-normal">
											<Search class="rounded-full" />
											<input
												class="text-offwhite w-full min-w-0 bg-transparent text-base font-light focus:outline-none "
												placeholder="Search"
											/>
										</div>
										{/* TODO: get the queried thing and load as a div element with one toggleButton and name and percentage */}
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
