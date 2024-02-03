import { Dialog } from "@kobalte/core";
import { Search, X } from "lucide-solid";
import { createSignal } from "solid-js";
import "./search-modal.css";
import { CurrencyToggleGroup } from "./table/filter-valmaps";
import SearchTable from "./table/search-table";
export default function SearchModal() {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog.Root open={open()} onOpenChange={setOpen}>
      <Dialog.Trigger class="button-default text-dark-gray relative flex-1 justify-start space-x-5">
        <Search class="text-primary ml-0" />
        <input
          class="text-dark-gray w-full bg-transparent text-base font-light focus:outline-none"
          placeholder="Search collections or wallets"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="z-60 w-100% h-100% pt-5px fixed left-0 top-0 flex justify-center bg-[hsla(0,5%,4%,.5)] shadow">
          <div
            id="searchScroll"
            class="ml--20px bg-background border-primary z-1000 lt-mdd:(max-w-[97vw] max-h-[80vh]) rounded-10px w-100% relative flex max-h-[60vh] max-w-[900px] justify-center overflow-auto overflow-x-hidden border "
          >
            <Dialog.Content class="w-100% " id="searchDialog">
              <div class="search-header py-7px px-10px relative flex items-center">
                <div class="button-default mr-7px flex w-[calc(100%-170px)]">
                  <Search class="text-primary ml-0" />
                  <input
                    class="text-dark-gray w-full bg-transparent text-base font-light focus:outline-none"
                    placeholder="Search collections or wallets"
                  />
                </div>
                <div class="mr-7px flex items-center">
                  <CurrencyToggleGroup />
                </div>
                <Dialog.CloseButton class="button-fill ">
                  <X />
                </Dialog.CloseButton>
              </div>
              <div class="">
                <SearchTable />
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
