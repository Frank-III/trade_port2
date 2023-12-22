import { Accessor, For, Setter } from "solid-js";
import { cn } from "~/utils/cn";

export const CatFilterMap = new Map([
  ["Volume", "vol"],
  ["Vol USD", "vol_usd"],
  ["Market cap", "mcap"],
  ["Sales", "sales"],
  ["Average", "avg"],
]);

export const TimeSpanMap = new Map([
  ["24 Hrs", 1],
  ["7 Days", 7],
  ["14 Days", 14],
  ["30 Days", 30],
  ["60 Days", 60],
  ["90 Days", 90],
  ["All Time", -1],
]);

export const Currency = ["all", "solana-sol", "ethereum"];

interface currencyToggleGroup {
  val: Accessor<string>;
  setVal: Setter<string>;
}

export function CurrencyToggleGroup(props: currencyToggleGroup) {
  return (
    <div class="button-default">
      <For each={Currency}>
        {(item, index) => (
          <div
            id={index().toString()}
            onClick={() => props.setVal(item)}
            class={cn(
              "text-md flex font-normal ",
              props.val() == item && "text-primary",
            )}
          >
            {item === "all" ? (
              <span>All</span>
            ) : (
              <div class={"i-mingcute-" + item + "-line"} />
            )}
          </div>
        )}
      </For>
    </div>
  );
}
