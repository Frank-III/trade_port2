import { Bell, Search } from "lucide-solid";
import { A } from "solid-start";
import { cn } from "~/utils/cn";
import logo from "/logo-icon.svg";

export default function Nav() {
  return (
    <div class="t-0 l-0 absolute z-[5] w-full">
      <nav class="fixed z-[500] m-auto flex w-full items-center justify-between border-b-1 border-[#2a2a2a] bg-[#13131353] px-5 pb-2 pt-3 transition max-[950px]:px-[10px] max-[950px]:pt-3">
        <div class="mr-2 flex flex-[0.6] items-center justify-between max-[1330px]:flex-[0.67] max-[1120px]:flex-1">
          <A
            class="-mt-[8px] ml-[4px] mr-[30px] inline-flex cursor-pointer space-x-2 max-[500px]:mr-[10px]"
            href="/"
          >
            <img
              src={logo}
              class="App-logo"
              alt="logo"
              height={24}
              width={24}
            />
            <span>TradePort</span>
          </A>
          <div class="button-default text-dark-gray relative flex-1 justify-start space-x-5">
            <Search class="text-primary ml-0" />
            <input
              class="text-dark-gray text-md w-full bg-transparent font-light focus:outline-none"
              placeholder="Search collections or wallets"
            />
          </div>
        </div>
        <div class="mb-[3px] flex  items-center justify-end space-x-2 font-normal">
          <button class="button-default rounded-full" type="button">
            <Bell size={24} />
          </button>
          <button class="button-default text-sm" type="button">Buy Solana</button>
          <button class="button-default px-3 text-sm " type="button">FeedBack ?</button>
          <button class="button-default text-primary border-[c77100] bg-[#432a11] text-sm" type="button">
            Connect Wallet
          </button>
        </div>
      </nav>
    </div>
  );
}
