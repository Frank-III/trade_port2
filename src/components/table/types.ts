
export interface Collection {
  name: string;
  avatar: string;
  supply: number;
}

export interface TrendingTableRow {
  collection: Collection;
  floor: number;
  market_cap: number;
  volume: number;
  volume_usd: number;
  sales: number;
  average: number;
  kind: "solana" | "ethereum" | "sui";
}

export interface MintingTableRow {
  collction: Collection;
  launched: Date;
  mint_price: number;
  floor: number;
  mint_vol: number;
  mint_vol_usd: number;
  num_mints: number;
  kind: "solana" | "ethereum" | "sui";
}

export interface TableProps<T> {
  data: T[];
}