import { Dialog } from "@kobalte/core";
import { CrossIcon, Search } from "lucide-solid";

export default function SearchModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger class="button-default text-dark-gray relative flex-1 justify-start space-x-5">
        <Search class="text-primary ml-0" />
        <input
          class="text-dark-gray text-md w-full bg-transparent font-light focus:outline-none"
          placeholder="Search collections or wallets"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="bg-background-color absolute relative top-0 max-h-[60vh] w-[100%] max-w-[900px] overflow-auto shadow" />
        <div class="border-primary border">
          <Dialog.Content class="">
            <div class="flex justify-center px-[10px] py-[7px]">
              <Dialog.Title class="">About Kobalte</Dialog.Title>
              <Dialog.CloseButton class="">
                <CrossIcon />
              </Dialog.CloseButton>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
