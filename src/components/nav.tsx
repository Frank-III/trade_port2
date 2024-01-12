import { Bell, Menu } from "lucide-solid";
import { A } from "solid-start";
import { cn } from "~/utils/cn";
import logo from "/logo-icon.svg";
import {
  type ComponentProps,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import SearchModal from "./search-modal";
import "./nav.css";

import { DropdownMenu } from "@kobalte/core";

const MoreDropdown = (props: ComponentProps<"div">) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class={cn("button-default px-1", "hidden lt-sm:flex", props.class)}
      >
        <Menu />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="dropdown-menu__content z-50 min-w-[8rem] rounded-md border border-neutral-700 bg-background p-1 text-popover-foreground shadow-md max-h-[90vh] w-screen overflow-auto">
          <DropdownMenu.Item>
            <button class="button-primary text-base" type="button">
              Connect Wallet
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <button
              class="button-default text-base hidden lt-smm:flex"
              type="button"
            >
              Buy Solana
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default function Nav() {
  const [scroll, setScroll] = createSignal(false);
  const handleScroll = () => {
    const scrollY = window.scrollY;
    setScroll(scrollY > 0 ? true : false);
  };

  createEffect(() => {
    window.addEventListener("scroll", handleScroll);
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });
  return (
    <div class="top-0 left-0 absolute z-[5] w-full">
      <nav
        class={cn(
          "fixed z-[500] m-auto flex w-full items-center justify-between border-b-0 border-[#2a2a2a]  px-5 pb-2 pt-3 transition lt-mdd:(px-[10px] pt-3)",
          scroll() ? "bg-background border-b-1" : "bg-[#13131353]"
        )}
      >
        <div class="mr-2 flex flex-[0.6] items-center justify-between lt-xll:flex-[0.67] lt-xll:flex-1">
          <A
            class="-mt-[8px] ml-[4px] mr-[30px] inline-flex cursor-pointer space-x-2 lt-smm:mr-[10px]"
            href="/"
          >
            <img
              src={logo}
              class="App-logo"
              alt="logo"
              height={24}
              width={24}
            />
            <span class="lt-mdd:hidden text-offwhite">TradePort</span>
          </A>
          <SearchModal />
        </div>
        <div class="mb-[3px] flex items-center justify-end space-x-2 font-normal ">
          <button
            class="button-default rounded-full group relative"
            type="button"
          >
            <Bell
              size={24}
              class="mt-[-1px] group-hover:-rotate-6 transition-all text-primary"
            />
            <div class=" absolute -top-1 -right-[9px] p-[2px] border border-border bg-dark-grey rounded-full flex items-center justify-center cursor-pointer group">
              <div class="i-logos-discord-icon text-15px group-hover:rotate-6 transition-all" />
            </div>
          </button>
          <button class="button-default text-sm lt-smm:hidden" type="button">
            Buy Solana
          </button>
          <button class="button-default px-3 text-sm " type="button">
            <span class="text-offwhite lt-sm:hidden">FeedBack</span> ?
          </button>
          <button class="button-primary text-sm lt-sm:hidden " type="button">
            Connect Wallet
          </button>
          <MoreDropdown />
        </div>
      </nav>
    </div>
  );
}
