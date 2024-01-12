import { faker } from "@faker-js/faker";
import { collapseVariantGroup } from "unocss";
import type {
  TrendingTableRow,
  Collection,
  MintingTableRow,
} from "~/components/table/types";

function createCollection() {
  return {
    name: faker.person.firstName(),
    avatar: faker.image.avatar(),
    supply: Number(
      faker.finance.amount({ min: 5, max: 10, dec: 3, symbol: "" })
    ),
    verified: faker.datatype.boolean(0.6),
    twitter: faker.internet.url(),
    website: faker.internet.url(),
  } as Collection;
}

export function createTrendingRow(): TrendingTableRow {
  return {
    collection: createCollection(),
    floor: Number(
      faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" })
    ),
    market_cap: Number(
      faker.finance.amount({ min: 5, max: 100000, dec: 0, symbol: "" })
    ),
    volume: Number(
      faker.finance.amount({ min: 10, max: 500, dec: 1, symbol: "" })
    ),
    volume_usd: Number(
      faker.finance.amount({ min: 10, max: 500, dec: 3, symbol: "" })
    ),
    sales: Number(
      faker.finance.amount({ min: 5, max: 1000, dec: 0, symbol: "" })
    ),
    average: Number(
      faker.finance.amount({ min: 5, max: 10, dec: 1, symbol: "" })
    ),
    kind: faker.helpers.arrayElement(["solana", "ethereum", "sui"]),
  } as TrendingTableRow;
}

// TODO: fix this unknown type
export function createMintingRow(): MintingTableRow {
  return {
    collection: createCollection(),
    launched: faker.date.past(),
    mint_price: Number(
      faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" })
    ),
    floor: Number(
      faker.finance.amount({ min: 0.1, max: 100, dec: 3, symbol: "" })
    ),
    mint_vol: Number(
      faker.finance.amount({ min: 10, max: 500, dec: 1, symbol: "" })
    ),
    mint_vol_usd: Number(
      faker.finance.amount({ min: 10, max: 500, dec: 3, symbol: "" })
    ),
    num_mints: Number(
      faker.finance.amount({ min: 5, max: 1000, dec: 0, symbol: "" })
    ),
    kind: faker.helpers.arrayElement(["solana", "ethereum", "sui"]),
  } as unknown as MintingTableRow;
}

export const fakeTrendingData = faker.helpers.multiple(createTrendingRow, {
  count: 5000,
});

export const fakeMintingData = faker.helpers.multiple(createMintingRow, {
  count: 5000,
});
