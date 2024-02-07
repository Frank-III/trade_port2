import { For } from "solid-js";
import { cn } from "~/utils/cn";
import { currency, setCurrency } from "./signals";

export const tsOptions = [
  { label: "24 Hrs", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "90 Days", value: 90 },
  { label: "All Time", value: -1 },
];

export const catOptions = [
  { label: "Volume", value: "vol" },
  { label: "Vol USD", value: "vol_usd" },
  { label: "Market cap", value: "mcap" },
  { label: "Sales", value: "sales" },
  { label: "Average", value: "avg" },
];

export const Currency = {
  all: "all",
  solana: "i-mingcute-solana-sol-line",
  ethereum: "i-mingcute-ethereum-line",
} as const;

export function CurrencyToggleGroup() {
  return (
    <div class="button-default rounded-8px">
      <For each={Object.entries(Currency)}>
        {([key, val], index) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            id={index().toString()}
            onClick={() => setCurrency(key as keyof typeof Currency)}
            class="text-md hover:(bg-[#333333]) flex rounded-md p-1 font-normal"
            classList={{
              "text-primary bg-[#432a11] hover:(text-primary bg-[#432a11])":
                currency() == key,
            }}
          >
            {key === "all" ? (
              <div class="cursor-pointer text-sm font-normal text-inherit">
                ALL
              </div>
            ) : (
              <div class={`${val} cursor-pointer text-[20px]`} />
            )}
          </div>
        )}
      </For>
    </div>
  );
}
