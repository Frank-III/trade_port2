import { Accessor } from "solid-js";
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
  collection: Collection;
  launched: Date;
  mint_price: number;
  floor: number;
  mint_vol: number;
  mint_vol_usd: number;
  num_mints: number;
  kind: "solana" | "ethereum" | "sui";
}

// TODO: derive these accessors
export interface TableProps {
  ts: Accessor<number>;
  currency: Accessor<"all" | "solana" | "ethereum">;
  cat: Accessor<string>;
}

export interface SniperState {
  rarityOpen: boolean;
  collection: string;
  min?: number;
  max?: number;
  search?: string;
}

export interface ListOrSaleTableRow {
  kind: "list" | "sale";
  collection: string;
  price: number;
  address: string;
  
}