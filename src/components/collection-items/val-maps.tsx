import { Gem, PiggyBank, Star, Image } from "lucide-solid";

export const viewSortMap = {
	"Price: Low to High": "price_asc",
	"Price: High to Low": "price_desc",
	"Rarity: Rare Common First": "rarity_asc",
	"Rarity: Rare First": "rarity_desc",
	"Token: Low to High": "token_asc",
	"Token: High to Low": "token_desc",
	"Recent Listed": "recent_listed",
};

const iconStyle = "";
export const viewSortLabelMap = {
	price_asc: <PiggyBank />,
	price_desc: <PiggyBank />,
	rarity_asc: <Star />,
	rarity_desc: <Star />,
	token_asc:<Image />
};
