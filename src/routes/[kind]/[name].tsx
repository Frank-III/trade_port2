import { useParams } from "solid-start";
import { CollectionDetail } from "~/components/collection_detail";
import Nav from "~/components/nav";

const DetailedPage = () => {
  const params = useParams();
  return (
    <main>
      <Nav />
      <div class="page-container p-[50px_20px_15px] max-w-[1600px] m-auto">
        <div class="collection-layout flex flex-col gap-10px w-100%">
          <div class="collection-top flex flex-wrap gap-10px gap-y-10px items-center justify-between">
            <CollectionDetail collectionName={params.name} />
          </div>
          <div class="collection-bottom"></div>
        </div>
      </div>
    </main>
  );
};
