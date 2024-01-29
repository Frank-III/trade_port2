import { For, type VoidComponent } from "solid-js";
// import { A, useParams } from "solid-start";
import { trpc } from "~/utils/trpc";
import Nav from "~/components/nav";
import { TableView } from "~/components/table/table-view";
import "./index.module.css";
import { useNavigate } from "solid-start";
import { Badge } from "~/components/badge";

const Home: VoidComponent = () => {
  const navigate = useNavigate();
  // const params = useParams();
  const hello = trpc.example.hello.useQuery(() => ({ name: "from tRPC" }));
  return (
    <main>
      <Nav />
      <div class="h-auto overflow-auto">
        <div class="w-100% h-350px t-0 absolute bg-[url(/hero-background.png)] " />
        <div class="pt-[60px]">
          <section class="lt-lgg:(m-w-[100%] px-[20px]) mt-50px max-w-1200px px-20px mx-auto mb-0">
            <div class="z-1 relative text-[43px]">
              <h1 class="lt-lgg:(text-center) m-w-[700px] m-0 w-[100%] bg-gradient-to-r from-[#f694fd] to-[#fff] bg-clip-text text-transparent">
                Multichain NFT
                <span class="block bg-gradient-to-r from-[#eb9514] to-[#f1cb91] bg-clip-text text-transparent">
                  Marketplace
                </span>
                <span class="block bg-gradient-to-r from-[#eb9514] to-[#f1cb91] bg-clip-text text-transparent">
                  & Aggregator
                </span>
              </h1>
              <div class="mt-15px lt-lgg:(justify-center) gap-5px flex flex-wrap items-center">
                <For each={["solana", "sui", "eth"]}>
                  {(item) => <Badge text={item} color="bg-red" />}
                </For>
              </div>
              <div class="lt-lgg:(justify-center) mt-15px flex flex-row items-center space-x-5 text-sm font-normal">
                <button
                  class="button-primary"
                  type="button"
                  onClick={() => navigate("/next")}
                >
                  Buy NFTs
                </button>
                <button class="button-secondary" type="button">
                  Buy NFTs
                </button>
              </div>
            </div>
            <div class="mt-[60px]" />
          </section>
        </div>
      </div>
      <TableView />
    </main>
  );
};

export default Home;
