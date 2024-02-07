import logo from "/logo-text.svg";

export function Footer() {
  return (
    <footer class="z-100 border-border bg-background lt-mdd:hidden sticky bottom-0 border-t">
      <div class="px-20px py-5px flex flex-wrap items-center justify-between">
        <div class="flex items-center">
          <div class="mr-10px mr-10px flex items-center justify-center">
            <img src={logo} alt="logo" class="w-120px h-30px" />
          </div>
          <div class="flex items-center justify-center">
            <span class="mr-5px text-sm font-normal">Powered By</span>
            <div class="i-twemoji:baby-chick text-18px" />
            <span class="text-offwhite text-base text-sm font-normal">
              &nbspFrankCorp
            </span>
          </div>
        </div>
        <div class="flex flex-wrap items-center">
          <div class="mr-25px text-xs font-normal text-[#4E4E4E]">
            2023 Frank, fake lnc. No rights reserved.
          </div>
          <div class="mr-5px flex items-center">
            <a href="#" class="mr-5px hover:text-offwhite text-xs font-normal">
              Privacy Policy
            </a>
            <a href="#" class="hover:text-offwhite text-xs font-normal">
              Terms of Service
            </a>
          </div>
          <div class="flex items-center justify-center">
            <a class="button-default h-auto rounded-xl p-1" href="#">
              <div class="i-codicon-twitter text-18px" />
            </a>
            <a class="button-default h-auto rounded-xl p-1" href="#">
              <div class="i-ic-baseline-discord text-18px" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
