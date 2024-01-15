import { Dialog } from "@kobalte/core";

export function LeftDrawer() {
  return (
    <Dialog.Root>
      <Dialog.Trigger class="lgg:hidden">
        <div class="i-mdi-filter-outline text-primary text-20px " />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed top-0 left-0 bg-[#171717] border border-border shadow h-100vh w-full max-w-420px overflow-auto z-200 overflow-y-scroll overflow-x-hidden">
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
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
