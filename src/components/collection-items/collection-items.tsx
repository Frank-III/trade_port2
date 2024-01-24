import { trpc } from "~/utils/trpc";
import {
  minPrice,
  maxPrice,
  status,
  filterRarityMin,
  filterRarityMax,
  marketPlace,
} from "~/components/collections/signals";

const name = "Lacy";

function CollectionItem() {}

export function CollectionItems(props: {
  filter: Record<string, Array<string>>;
}) {
  const collectionItemsQuery = trpc.nftRouter.collectionItems.useInfiniteQuery(
    () => ({
      collection: name,
      filters: props.filter,
      minPrice: minPrice(),
      maxPrice: maxPrice(),
      minRarity: filterRarityMin(),
      maxRarity: filterRarityMax(),
      listed: status(),
      marketPlace: marketPlace(),
    })
  );
}
