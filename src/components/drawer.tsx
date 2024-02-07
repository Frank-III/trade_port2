import { Dialog } from "@kobalte/core";
import Filter, { type FilterProps } from "~/components/collections/filter";
import { leftDrawerOpen, setLeftDrawerOpen } from "./global-signals";
export function LeftDrawer(props: FilterProps) {
  return (
    <Dialog.Root open={leftDrawerOpen()} onOpenChange={setLeftDrawerOpen}>
      {/* <Dialog.Trigger class="lgg:hidden">
        <div class="i-mdi-filter-outline text-primary text-20px " />
      </Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Overlay class="border-border h-100vh max-w-420px z-200 fixed left-0 top-0 w-full overflow-auto overflow-x-hidden overflow-y-scroll border bg-[#171717] shadow">
          <Dialog.Content class="w-full">
            <div class="flex justify-between">
              <div class="flex">
                <div class="i-mdi-filter-outline text-primary text-24px" />
                <Dialog.Title class="">Filter</Dialog.Title>
              </div>
              <Dialog.CloseButton>
                <div class="i-mdi-close icon-default" />
              </Dialog.CloseButton>
            </div>
            <Filter
              collection={props.collection}
              filter={props.filter}
              filterSetter={props.filterSetter}
            />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
