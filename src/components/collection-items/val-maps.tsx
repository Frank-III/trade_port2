import {
  PiggyBank,
  Star,
  Image,
  ListStart,
  Activity,
  ShoppingCart,
  Tag,
  Gavel,
  BankNote,
  Coins,
} from "lucide-solid";
import { SelectItem } from "../generic-select";
import { ActivityKind } from "./signals";

const iconStyle = "w-[20px] h-[20px] icon-default";

export const viewSortOptions = [
  {
    value: "price_asc",
    label: "Price: Low to High",
    icon: () => <PiggyBank class={iconStyle} />,
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
    icon: () => <PiggyBank class={iconStyle} />,
  },
  {
    value: "rarity_asc",
    label: "Rarity: Rare Common First",
    icon: () => <Star class={iconStyle} />,
  },
  {
    value: "rarity_desc",
    label: "Rarity: Rare First",
    icon: () => <Star class={iconStyle} />,
  },
  {
    value: "token_asc",
    label: "Token: Low to High",
    icon: () => <Image class={iconStyle} />,
  },
  {
    value: "token_desc",
    label: "Token: High to Low",
    icon: () => <Image class={iconStyle} />,
  },
  {
    value: "recent_listed",
    label: "Recent Listed",
    icon: () => <ListStart class={iconStyle} />,
  },
];

export const activityOptions: SelectItem<ActivityKind>[] = [
  {
    value: "all",
    label: "All Activity",
    icon: () => <Activity class={iconStyle} />,
  },
  {
    value: "sales",
    label: "Sales",
    icon: () => <ShoppingCart class={iconStyle} />,
  },
  {
    value: "listings",
    label: "Listings",
    icon: () => <Tag class={iconStyle} />,
  },
  {
    value: "bids",
    label: "Bids",
    icon: () => <Gavel class={iconStyle} />,
  },
  {
    value: "transfers",
    label: "Transfers",
    icon: () => <div class={`i-ci-transfer ${iconStyle}`} />,
  },
  {
    value: "mints",
    label: "Mints",
    icon: () => <Coins class={iconStyle} />,
  },
  {
    value: "stakess",
    label: "Stakes",
    icon: () => <BankNote class={iconStyle} />,
  },
];
