import { type VoidComponent } from "solid-js";
// import { A, useParams } from "solid-start";
import { trpc } from "~/utils/trpc";
import Nav from "~/components/nav";
import { TableView } from "~/components/table/table-view";
import "./index.module.css";

const Home: VoidComponent = () => {
  // const params = useParams();
  const hello = trpc.example.hello.useQuery(() => ({ name: "from tRPC" }));
  return (
    <main>
      <Nav />
      <div class="h-auto overflow-auto">
        <div class="w-100% h-350px t-0 absolute bg-[url(/hero-background.png)] " />
        <div class="pt-[60px]">
          <section class="lgg:(m-w-[100%] px-[20px]) mx-auto mb-0 mt-[50px] w-[100%]">
            <div class="z-1 relative text-[43px]">
              <h1 class="lgg:(text-center) m-w-[700px] m-0 w-[100%] bg-gradient-to-r from-[#f694fd] to-[#fff] bg-clip-text text-transparent">
                Multichain NFT
                <span class="block bg-gradient-to-r from-[#eb9514] to-[#f1cb91] bg-clip-text text-transparent">
                  Marketplace
                </span>
                <span class="block bg-gradient-to-r from-[#eb9514] to-[#f1cb91] bg-clip-text text-transparent">
                  & Aggregator
                </span>
              </h1>
            </div>
            <div class="mt-[60px]" />
          </section>
        </div>
      </div>
      <div class="flex w-full flex-col">
        <div class="mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-3 px-3 py-1">
          <p>{hello.data ?? "Loading tRPC query"}</p>
        </div>
        <TableView />
      </div>
    </main>
  );
};

export default Home;
