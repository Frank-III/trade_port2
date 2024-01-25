import { Gem, PiggyBank, Star, Image, ListStart } from "lucide-solid";

export const viewSortMap = new Map([
	["Price: Low to High", "price_asc"],
	["Price: High to Low", "price_desc"],
	["Rarity: Rare Common First", "rarity_asc"],
	["Rarity: Rare First", "rarity_desc"],
	["Token: Low to High", "token_asc"],
	["Token: High to Low", "token_desc"],
	["Recent Listed", "recent_listed"],
]);

const iconStyle = "w-[20px] h-[20px] icon-default";
export const viewSortLabelMap = {
	"Price: Low to High": <PiggyBank class={iconStyle} />,
	"Price: High to Low": <PiggyBank class={iconStyle} />,
	"Rarity: Rare Common First": <Star class={iconStyle} />,
	"Rarity: Rare First": <Star class={iconStyle} />,
	"Token: Low to High": <Image class={iconStyle} />,
	"Token: High to Low": <Image class={iconStyle} />,
	"Recent Listed": <ListStart class={iconStyle} />,
};
