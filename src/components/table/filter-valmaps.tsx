import { For } from "solid-js";
import { cn } from "~/utils/cn";
import { currency, setCurrency } from "./signals";

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

export const Currency = [
  { name: "all", icon: "all" },
  { name: "solana", icon: "i-mingcute-solana-sol-line" },
  { name: "ethereum", icon: "i-mingcute-ethereum-line" },
] as const;

export function CurrencyToggleGroup() {
  return (
    <div class="button-default rounded-8px">
      <For each={Currency}>
        {(item, index) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            id={index().toString()}
            onClick={() => setCurrency(item.name)}
            class={cn(
              "text-md flex font-normal p-1 rounded-md hover:(bg-[#333333])",
              currency() === item.name &&
                "text-primary bg-[#432a11] hover:(text-primary bg-[#432a11])"
            )}
          >
            {item.name === "all" ? (
              <div class="text-inherit text-sm font-normal cursor-pointer">
                ALL
              </div>
            ) : (
              <div class={`${item.icon} text-[20px] cursor-pointer`} />
            )}
          </div>
        )}
      </For>
    </div>
  );
}
