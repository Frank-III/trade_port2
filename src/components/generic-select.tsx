import { Select } from "@kobalte/core";
import { ChevronUpIcon, ChevronDownIcon, TimerReset } from "lucide-solid";
import { type Accessor, type Setter, ComponentProps } from "solid-js";
import "./select.css";

export const TimeSpanMap = new Map([
	["24 Hrs", 1],
	["7 Days", 7],
	["14 Days", 14],
	["30 Days", 30],
	["60 Days", 60],
	["90 Days", 90],
	["All Time", -1],
]);

interface GenericSelectProps<T> extends ComponentProps<"div"> {
	valMap: Map<string, T>;
	labelIcon: Element;
	val: Accessor<string>;
	setVal: Setter<string>;
}

export default function GenericSelect<T>(props: GenericSelectProps<T>) {
	const options = Array.from(props.valMap.keys());
	return (
		<Select.Root
			value={props.val()}
			onChange={props.setVal}
			options={options}
			defaultValue={options[0]}
			itemComponent={(item_props) => (
				<Select.Item
					item={item_props.item}
					class="text-offwhite bg-background hover:bg-background-hover [&[data-selected]]:text-primary flex cursor-pointer list-none items-center justify-start gap-1.5 rounded-sm py-1 pl-1 pr-2 focus:outline-none"
				>
					<Select.Icon class="rounded-full">{props.labelIcon}</Select.Icon>
					<Select.ItemLabel class="text-offwhite text-sm font-normal">
						{item_props.item.rawValue}
					</Select.ItemLabel>
				</Select.Item>
			)}
			class={props.class}
		>
			<Select.Trigger class="button-default" aria-label="Some Select">
				<Select.Icon class="">{props.labelIcon}</Select.Icon>
				<Select.Value<string> class="text-offwhite text-sm font-normal">
					{(state) => state.selectedOption()}
				</Select.Value>
				<Select.Icon class="i-octicon-chevron-down-16 [&[data-expanded]]:rotate-180" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class="select-content bg-background-body z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-700 p-1 shadow-md">
					<Select.Listbox class="my-0 items-start px-0 focus:outline-none" />
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}