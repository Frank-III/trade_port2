import { Image, Tooltip } from "@kobalte/core";
import { type CollectionWithProperties } from "~/server/trpc/router/_app";
import { Image as ImageIcon } from "lucide-solid";
import { Accessor, Setter, Show, Suspense } from "solid-js";
import { trpc } from "~/utils/trpc";
import { A } from "solid-start";
import { cn } from "~/utils/cn";
import "./collection-detail.css";

interface CollectionDetailProps {
  collection: CollectionWithProperties;
}

const VerifiedBadge = () => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger class="text-primary bg-background">
        <div class="i-codicon-verified-filled text-20px" />
        {/* <BadgeCheck class="text-primary bg-background" /> */}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="tooltip__content border-1 border-border bg-background text-base-font-receding-color p-10px z-50 rounded-md text-base font-light">
          <Tooltip.Arrow />
          <p>Verified Collection</p>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export function CollectionDetail(props: CollectionDetailProps) {
  return (
    <div class="button-default p-8px justify-unset rounded-16px hover:bg-background-body h-auto w-full flex-[415px]">
      <div class="text-table flex flex-row items-center space-x-3 ">
        <Image.Root
          fallbackDelay={300}
          class="h-60px w-60px lt-smm:(h-50px w-50px)"
        >
          <Image.Img
            class="rounded-md object-fill"
            src={props.collection?.avatar || ""}
            alt="nft collection avatar"
          />
          <Image.Fallback>{props.collection?.name.slice(0, 1)}</Image.Fallback>
        </Image.Root>
        <div class="ml-10px space-y-5px flex flex-col items-start">
          <div class="space-x-5px flex flex-row flex-wrap justify-center">
            <div class="text-offwhite text-lg ">{props.collection?.name}</div>
            <Show when={props.collection?.verified}>
              <VerifiedBadge />
            </Show>
            <Show when={props.collection?.twitter}>
              <A
                class="button-default p-2px h-auto rounded-lg"
                href={props.collection?.twitter!}
              >
                <div class="i-codicon-twitter text-18px" />
              </A>
            </Show>
            <Show when={props.collection?.website}>
              <A
                class="button-default p-2px h-auto rounded-lg"
                href={props.collection?.website}
              >
                <div class="i-codicon-globe text-18px" />
              </A>
            </Show>
          </div>
          <div class="lt-smm:flex-wrap flex items-center justify-start ">
            <div class="text-table text-base-font-receding-color">
              Supply: {props.collection?.supply}
            </div>
            <div class="button-default w-200px ml-15px lt-smm:(ml-0 w-full) gap-0 text-sm font-normal ">
              <ImageIcon class="rounded-full" />
              <input
                class="text-offwhite w-full w-full flex-grow bg-transparent text-base font-light focus:outline-none"
                placeholder="Search"
              />
              <button
                class="button-primary min-h-15px text-primary h-auto border-none p-[3px_8px]"
                type="button"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollectionStats(props: CollectionDetailProps) {
  const statStyles =
    "flex flex-col items-center min-w-110px px-15px py-0 border-l border-border text-base font-normal lt-xss:(min-w-100px p-[0px_5px]) lt-smm:(flex-1) lt-sm:(basis-25% p-[0px_5px])";
  return (
    <div class="gap-y-10px p-10px border-border relative flex flex-row flex-wrap items-center justify-end rounded-lg border">
      <div class={cn(statStyles, "border-l-none")}>
        <span>Floor Price</span>
        <span>139.9</span>
      </div>
      <div class={statStyles}>
        <span>Top Bid</span>
        <span>139.9</span>
      </div>
      <div class={statStyles}>
        <span>Total Volume</span>
        <span>139.9</span>
      </div>
      <div class={statStyles}>
        <span>1D Volume</span>
        <span>139.9</span>
      </div>
      <div class={statStyles}>
        <span>1D Sales</span>
        <span>139.9</span>
      </div>
      <div class={statStyles}>
        <span>Mint Volume</span>
        <span>139.9</span>
      </div>
      <div class={statStyles}>
        <span>Listed</span>
        <span>139.9</span>
      </div>
    </div>
  );
}
