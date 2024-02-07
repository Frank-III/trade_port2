import Filter from "./filter";
import { Filter as FilterIcon } from "lucide-solid";
import { filterDialogOpen, setFilterDialogOpen } from "./signals";
import { Dialog } from "@kobalte/core";
import { cn } from "~/utils/cn";
import { type CollectionWithProperties } from "~/server/trpc/router/_app";

interface FilterDialogProps {
  collection: CollectionWithProperties;
}
export function FilterDialog(props: FilterDialogProps) {
  return (
    <Dialog.Root
      open={filterDialogOpen()}
      onOpenChange={(o) => {
        setFilterDialogOpen(!o);
      }}
    >
      {/* TODO: make use of checkbox input and label and use ::before tag to make it with the use of signal */}
      <Dialog.Trigger>
        <button
          classList={{
            "text-primary": filterDialogOpen(),
          }}
          type="button"
        >
          <FilterIcon size={20} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="z-99 fixed left-0 top-0 bg-[hsla(0,5%,4%,.5)]">
          <Dialog.Content class="w-full">
            <Filter collection={props.collection} />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
