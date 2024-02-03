import { Select } from "@kobalte/core";
import { ChevronUpIcon, ChevronDownIcon, TimerReset, Gem } from "lucide-solid";
import {
  type Accessor,
  type Setter,
  ComponentProps,
  type JSX,
  Show,
} from "solid-js";
import "./select.css";

export interface SelectItem<T> {
  label: string;
  value: T;
  icon?: () => JSX.Element;
}

interface GenericSelectProps2<T> extends ComponentProps<"div"> {
  options: SelectItem<T>[];
  val: Accessor<T>;
  setVal: Setter<T>;
  defaultIcon?: JSX.Element;
}
export function GenericSelect2<T>(props: GenericSelectProps2<T>) {
  // How can I get the value of the selected option? --> seems to work for now
  return (
    <Select.Root
      options={props.options}
      // value={props.val()}
      defaultValue={props.options[0]}
      optionValue="value"
      optionTextValue="label"
      // optionDisabled="disabled"
      disallowEmptySelection
      class={props.class}
      onChange={(s) => {
        props.setVal(s.value);
      }}
      placeholder="Select a fruit…"
      itemComponent={(propsInner) => (
        <Select.Item
          item={propsInner.item}
          class="text-offwhite bg-background hover:bg-background-hover [&[data-selected]]:text-primary flex cursor-pointer list-none items-center justify-start gap-1.5 rounded-sm py-1 pl-1 pr-2 focus:outline-none"
        >
          <Show
            when={propsInner.item.rawValue.icon}
            fallback={
              <Select.Icon class="rounded-full">
                {props.defaultIcon}
              </Select.Icon>
            }
          >
            <Select.Icon class="rounded-full">
              {propsInner.item.rawValue.icon()}
            </Select.Icon>
          </Show>
          <Select.ItemLabel class="text-offwhite text-sm font-normal">
            {propsInner.item.rawValue.label}
          </Select.ItemLabel>
        </Select.Item>
      )}
    >
      <Select.Trigger aria-label="some-text" class="button-default">
        <Select.Value<SelectItem<T>>>
          {(state) => (
            <div class="flex flex-row items-center  justify-center gap-0.5">
              <Show
                when={state.selectedOption().icon}
                fallback={props.defaultIcon}
              >
                {state.selectedOption().icon()}
              </Show>
              {/* <Gem /> */}
              <span class="text-offwhite text-sm font-normal">
                {state.selectedOption().label}
              </span>
            </div>
          )}
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
