import { Bell, Menu } from "lucide-solid";
import { A, useLocation } from "@solidjs/router";
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
    <DropdownMenu.Root overflowPadding={0}>
      <DropdownMenu.Trigger
        class={cn("button-default px-1", "lt-sm:flex hidden", props.class)}
      >
        <DropdownMenu.Icon class="i-ic-baseline-menu [&[data-expanded]]:i-material-symbols-close-rounded " />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="dropdown-menu__content bg-background text-popover-foreground z-50 max-h-[90vh] w-screen min-w-[8rem] overflow-auto rounded-md border border-neutral-700 p-1 shadow-md">
          <span class="left-0 top-0 text-sm font-normal">Profile</span>
          <DropdownMenu.Item>
            <button class="button-primary text-primary text-base" type="button">
              <span>Connect Wallet</span>
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Separator class="border-border m-6px " />
          <DropdownMenu.Item>
            <button
              class="button-default lt-smm:flex hidden text-base"
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
  const loc = useLocation();
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
    <div class="absolute left-0 top-0 z-[5] w-full">
      <nav
        class={cn(
          "lt-mdd:(px-[10px] pt-3) fixed z-[500] m-auto flex w-full items-center justify-between  border-b-0 border-[#2a2a2a] px-5 pb-2 pt-3 transition",
          scroll() ? "bg-background border-b-1" : "bg-[#13131353]",
        )}
      >
        <div class="lt-xll:flex-[0.67] lt-xll:flex-1 mr-2 flex flex-[0.6] items-center justify-between">
          <A
            class="lt-smm:mr-[10px] -mt-[8px] ml-[4px] mr-[30px] inline-flex cursor-pointer space-x-2"
            href="/"
            onClick={() => {
              if (loc.pathname === "/")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
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
            class="button-default group relative rounded-full"
            type="button"
          >
            <Bell
              size={24}
              class="text-primary mt-[-1px] transition-all group-hover:-rotate-6"
            />
            <div class=" border-border bg-dark-grey group absolute -right-[9px] -top-1 flex cursor-pointer items-center justify-center rounded-full border p-[2px]">
              <div class="i-logos-discord-icon text-15px transition-all group-hover:rotate-6" />
            </div>
          </button>
          <button class="button-default lt-smm:hidden text-sm" type="button">
            Buy Solana
          </button>
          <button class="button-default px-3 text-sm " type="button">
            <span class="text-offwhite lt-sm:hidden">FeedBack</span> ?
          </button>
          <button
            class="button-primary lt-sm:hidden text-primary text-sm"
            type="button"
          >
            Connect Wallet
          </button>
          <MoreDropdown />
        </div>
      </nav>
    </div>
  );
}
