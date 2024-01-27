import { Image, Skeleton } from "@kobalte/core";
import { For } from "solid-js";

export function GenericRowSkeleton<T>(props: {
  exampleRow: T;
  limits: number;
}) {
  return (
    <For each={Array.from({ length: props.limits }, (_, i) => i)}>
      {(item, idx) => (
        <div
          id={idx.toString()}
          class="border-border-color relative flex flex items-center border-b-[solid_1px] p-[6.5px_0px_6.5px_15px] pt-[8px]"
        >
          <div class="flex-[3_1_0%] overflow-hidden ">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="flex flex-row items-center space-x-3">
                <img
                  class="h-[42px] w-[42px] rounded-full"
                  alt="nft collection avatar"
                />
                <div class="flex flex-col">
                  <div class="text-table">name</div>
                  <div class="text-table text-xs">supply</div>
                </div>
              </div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 SOL</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[1_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">100 NFTs</div>
            </Skeleton.Root>
          </div>
          <div class="flex-[0.8_1_0%]">
            <Skeleton.Root class="skeleton" radius={5}>
              <div class="text-table">10 NFTs</div>
            </Skeleton.Root>
          </div>
        </div>
      )}
    </For>
  );
}
