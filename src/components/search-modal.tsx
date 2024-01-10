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
          class="text-dark-gray text-base w-full bg-transparent font-light focus:outline-none"
          placeholder="Search collections or wallets"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="z-60 bg-[hsla(0,5%,4%,.5)] fixed top-0 flex w-100% h-100% shadow left-0 pt-5px justify-center">
          <div
            id="searchScroll"
            class="ml--20px bg-background border-primary border z-1000 flex justify-center max-w-[900px] max-h-[60vh] lt-mdd:(max-w-[97vw] max-h-[80vh]) relative overflow-x-hidden overflow-y-scroll rounded-10px w-100%"
          >
            <Dialog.Content class="w-100%" id="searchDialog">
              <div class="search-header flex items-center relative py-7px px-10px">
                <div class="flex w-[calc(100%-170px)] button-default mr-7px">
                  <Search class="text-primary ml-0" />
                  <input
                    class="text-dark-gray text-base w-full bg-transparent font-light focus:outline-none"
                    placeholder="Search collections or wallets"
                  />
                </div>
                <div class="flex items-center mr-7px">
                  <CurrencyToggleGroup />
                </div>
                <Dialog.CloseButton class="button-fill ">
                  <X />
                </Dialog.CloseButton>
              </div>
              <div class="h-100%">
                <SearchTable />
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
