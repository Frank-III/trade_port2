import { relations } from "drizzle-orm";
import {
  mysqlTable,
  int,
  timestamp,
  boolean,
  text,
  real,
  index,
  bigint,
} from "drizzle-orm/mysql-core";

// what need to change here:
// 1. integer? -> int/bigint?
// 2. integer-boolean -> boolean
// Define Collections table
export const collections = mysqlTable("Collections", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  supply: real("supply").notNull(),
  verified: boolean("verified").notNull(),
  twitter: text("twitter"),
  website: text("website"),
});

// Define CollectionAttributes table
export const collectionAttributes = mysqlTable(
  "CollectionAttributes",
  {
    id: int("id").primaryKey().autoincrement(),
    collection_id: int("collection_id").notNull(),
    name: text("name").notNull(),
    // Foreign key relation is handled at application level
  },
  (table) => {
    return {
      idx_collection_id: index("idx_collection_id").on(table.collection_id),
    };
  },
);

// Define AttributeKinds table
export const attributeKinds = mysqlTable(
  "AttributeKinds",
  {
    id: int("id").primaryKey().autoincrement(),
    attribute_id: int("attribute_id")
      .notNull()
      .references(() => collectionAttributes.id),
    name: text("name").notNull(),
    //statisic
    value: int("value").notNull(),

    // Foreign key relation is handled at application level
  },
  (table) => {
    return {
      idx_attribute_id: index("idx_attribute_id").on(table.attribute_id),
    };
  },
);

// Define Items table
export const items = mysqlTable("Items", {
  id: int("id").primaryKey().autoincrement(),
  collection_id: int("collection_id")
    .notNull()
    .references(() => collections.id),
  name: text("name").notNull(),
  image: text("image"),
  rarity: int("rarity").notNull(),
  price: real("price").notNull(),
  topBid: real("topBid").notNull(),
  lastAction: text("lastAction").notNull(),
  tokenId: text("tokenId").notNull(),
  owner: text("owner").notNull(),
  // Foreign key relation is handled at application level
});

// Define ItemAttributes table
export const itemAttributes = mysqlTable(
  "ItemAttributes",
  {
    id: int("id").primaryKey().autoincrement(),
    item_id: int("item_id")
      .notNull()
      .references(() => items.id),
    kind_id: int("kind_id")
      .notNull()
      .references(() => attributeKinds.id),
    // Foreign key relations are handled at application level
  },
  (table) => {
    return {
      idx_item_id: index("idx_item_id").on(table.item_id),
      idx_kind_id: index("idx_kind_id").on(table.kind_id),
    };
  },
);

// itemActivities table
export const itemActivities = mysqlTable("ItemActivities", {
  id: int("id").primaryKey().autoincrement(),
  item_id: int("item_id")
    .notNull()
    .references(() => items.id),
  type: text("type", {
    enum: [
      "sales",
      "listing",
      "accept_bids",
      "bids",
      "transfer",
      "mints",
      "stakes",
    ],
  }).notNull(),
  price: real("price"),
  from: text("from"),
  to: text("to"),
  time: text("time").notNull(),
});

// Define TrendingRows table
export const trending = mysqlTable("Trending", {
  id: int("id").primaryKey().autoincrement(),
  collection_id: int("collection_id")
    .notNull()
    .references(() => collections.id),
  floor: real("floor").notNull(),
  market_cap: real("market_cap").notNull(),
  volume: real("volume").notNull(),
  volume_usd: real("volume_usd").notNull(),
  sales: int("sales").notNull(),
  average: real("average").notNull(),
  kind: text("kind", { enum: ["solana", "ethereum", "sui"] }).notNull(),
});

// Define MintingRows table
export const minting = mysqlTable("Minting", {
  id: int("id").primaryKey().autoincrement(),
  collection_id: int("collection_id")
    .notNull()
    .references(() => collections.id),
  // launched: integer("launched", { mode: "timestamp" }).notNull(), // Assuming DATETIME as a timestamp
  launched: timestamp("launched", { mode: "string" }).notNull(), // Assuming DATETIME as a timestamp
  mint_price: real("mint_price").notNull(),
  floor: real("floor").notNull(),
  mint_vol: real("mint_vol").notNull(),
  mint_vol_usd: real("mint_vol_usd").notNull(),
  num_mints: int("num_mints").notNull(),
  kind: text("kind", { enum: ["solana", "ethereum", "sui"] }).notNull(),
});

export const collectionRelationShip = relations(collections, ({ many }) => ({
  attributes: many(collectionAttributes),
  items: many(items),
  trending: many(trending),
  minting: many(minting),
}));

export const trendingRelationShip = relations(trending, ({ one }) => ({
  collection: one(collections, {
    fields: [trending.collection_id],
    references: [collections.id],
  }),
}));

export const mintingRelationship = relations(minting, ({ one }) => ({
  collection: one(collections, {
    fields: [minting.collection_id],
    references: [collections.id],
  }),
}));

export const attributeRelationShip = relations(
  collectionAttributes,
  ({ one, many }) => ({
    collection: one(collections, {
      fields: [collectionAttributes.collection_id],
      references: [collections.id],
    }),
    kinds: many(attributeKinds),
  }),
);

export const kindRelationShip = relations(attributeKinds, ({ one, many }) => ({
  attribute: one(collectionAttributes, {
    fields: [attributeKinds.attribute_id],
    references: [collectionAttributes.id],
  }),
  itemAttributes: many(itemAttributes),
}));

export const itemRelationShip = relations(items, ({ one, many }) => ({
  collection: one(collections, {
    fields: [items.collection_id],
    references: [collections.id],
  }),
  itemAttributes: many(itemAttributes),
  activities: many(itemActivities),
}));

export const itemAttributeRelationShip = relations(
  itemAttributes,
  ({ one }) => ({
    item: one(items, {
      fields: [itemAttributes.item_id],
      references: [items.id],
    }),
    kind: one(attributeKinds, {
      fields: [itemAttributes.kind_id],
      references: [attributeKinds.id],
    }),
  }),
);

export const itemActivityRelationShip = relations(
  itemActivities,
  ({ one }) => ({
    item: one(items, {
      fields: [itemActivities.item_id],
      references: [items.id],
    }),
  }),
);
