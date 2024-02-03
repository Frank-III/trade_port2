import {
  PiggyBank,
  Star,
  Image,
  ListStart,
  Activity,
  ShoppingCart,
  Tag,
  Gavel,
  Banknote,
  Coins,
  SmartphoneNfc,
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
    value: "listing",
    label: "Listings",
    icon: () => <Tag class={iconStyle} />,
  },
  {
    value: "bids",
    label: "Bids",
    icon: () => <Gavel class={iconStyle} />,
  },
  {
    value: "transfer",
    label: "Transfers",
    icon: () => <SmartphoneNfc class={iconStyle} />,
  },
  {
    value: "mints",
    label: "Mints",
    icon: () => <Coins class={iconStyle} />,
  },
  {
    value: "stakes",
    label: "Stakes",
    icon: () => <Banknote class={iconStyle} />,
  },
];

export const activityIconMap = {
  sales: ShoppingCart,
  listing: Tag,
  bids: Gavel,
  transfer: SmartphoneNfc,
  mints: Coins,
  stakes: Banknote,
};

export const timeSpanOptions = [
  { label: "7 Days", value: 7 },
  { label: "1 Hrs", value: 1 / 24 },
  { label: "4 Hrs", value: 4 / 24 },
  { label: "1 Day", value: 1 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "90 Days", value: 90 },
  { label: "All Time", value: -1 },
];
