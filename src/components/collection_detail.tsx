import { Image, Tooltip } from "@kobalte/core";
import { Collection } from "./table/types";
import { BadgeCheck, Globe, Twitter, Image as ImageIcon } from "lucide-solid";

import { Show, Suspense } from "solid-js";
import { trpc } from "~/utils/trpc";
import { A } from "solid-start";

interface CollectionDetailProps {
  collectionName: string;
}

const VerifiedBadge = () => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger class="text-primary bg-background">
        <div class="i-codicon-verified-filled text-20px" />
        {/* <BadgeCheck class="text-primary bg-background" /> */}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="tooltip__content z-50 border-1 border-border bg-background rounded-sm text-base-font-receding-color p-10px text-base font-light">
          <Tooltip.Arrow />
          <p>Verified Collection</p>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export function CollectionDetail(props: CollectionDetailProps) {
  const query = trpc.nftRouter.collectionDetail.useQuery(() => ({
    kind: "solana",
    name: props.collectionName,
  }));

  return (
    <Suspense fallback={<div>loading</div>}>
      <div class="button-default h-auto p-10px w-full justify-unset rounded-16px hover:bg-background-body">
        <div class="flex flex-row items-center space-x-3 text-table ">
          <Image.Root fallbackDelay={300} class="h-60px w-60px ">
            <Image.Img
              class="object-fill rounded-md"
              src={query.data?.collection.avatar}
              alt="nft collection avatar"
            />
            <Image.Fallback>
              {query.data?.collection.name.slice(0, 1)}
            </Image.Fallback>
          </Image.Root>
          <div class="flex flex-col ml-10px">
            <div>
              <div class="flex flex-row flex-wrap space-x-5px justify-center">
                <div class="text-lg text-offwhite ">
                  {query.data?.collection.name}
                </div>
                <Show when={query.data?.collection.verified}>
                  <VerifiedBadge />
                </Show>
                <Show when={query.data?.collection.twitter !== undefined}>
                  <A
                    class="button-default h-auto rounded-lg p-2px"
                    href={query.data?.collection.twitter!}
                  >
                    <div class="i-codicon-twitter text-20px" />
                    {/* <Twitter size={20} /> */}
                  </A>
                </Show>
                <Show when={query.data?.collection.website !== undefined}>
                  <A
                    class="button-default h-auto rounded-lg p-2px"
                    href={query.data?.collection.website!}
                  >
                    <div class="i-codicon-globe text-20px" />
                    {/* <Globe size={20} /> */}
                  </A>
                </Show>
              </div>
              <div class="flex justify-center">
                <div class="text-table text-base-font-receding-color">
                  {query.data?.collection.supply}
                </div>
                <div class="button-default font-normal text-sm w-200px">
                  <ImageIcon class="rounded-full" />
                  <input
                    class="text-offwhite text-base w-full bg-transparent font-light focus:outline-none "
                    placeholder="Search"
                  />
                  <button
                    class="button-primary h-auto p-[3px_8px] min-h-15px border-none text-primary"
                    type="button"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
