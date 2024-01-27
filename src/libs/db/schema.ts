import { relations } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
  real,
  index,
} from "drizzle-orm/sqlite-core";

// Define Collections table
export const collections = sqliteTable("Collections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  avatar: text("avatar"),
  supply: real("supply").notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull(),
  twitter: text("twitter"),
  website: text("website"),
});

// Define CollectionAttributes table
export const collectionAttributes = sqliteTable(
  "CollectionAttributes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    collection_id: integer("collection_id").notNull(),
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
export const attributeKinds = sqliteTable(
  "AttributeKinds",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    attribute_id: integer("attribute_id")
      .notNull()
      .references(() => collectionAttributes.id),
    name: text("name").notNull(),
    //statisic
    value: integer("value").notNull(),

    // Foreign key relation is handled at application level
  },
  (table) => {
    return {
      idx_attribute_id: index("idx_attribute_id").on(table.attribute_id),
    };
  },
);

// Define Items table
export const items = sqliteTable("Items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  collection_id: integer("collection_id")
    .notNull()
    .references(() => collections.id),
  name: text("name").notNull(),
  image: text("image"),
  lastBid: real("lastBid").notNull(),
  lastSale: real("lastSale").notNull(),
  tokenId: text("tokenId").notNull(),
  // Foreign key relation is handled at application level
});

// Define ItemAttributes table
export const itemAttributes = sqliteTable(
  "ItemAttributes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    item_id: integer("item_id")
      .notNull()
      .references(() => items.id),
    kind_id: integer("kind_id")
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

// Define TrendingRows table
export const trending = sqliteTable("Trending", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  collection_id: integer("collection_id")
    .notNull()
    .references(() => collections.id),
  floor: real("floor").notNull(),
  market_cap: real("market_cap").notNull(),
  volume: real("volume").notNull(),
  volume_usd: real("volume_usd").notNull(),
  sales: integer("sales").notNull(),
  average: real("average").notNull(),
  kind: text("kind", { enum: ["solana", "ethereum", "sui"] }).notNull(),
});

// Define MintingRows table
export const minting = sqliteTable("Minting", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  collection_id: integer("collection_id")
    .notNull()
    .references(() => collections.id),
  launched: integer("launched", { mode: "timestamp" }).notNull(), // Assuming DATETIME as a timestamp
  mint_price: real("mint_price").notNull(),
  floor: real("floor").notNull(),
  mint_vol: real("mint_vol").notNull(),
  mint_vol_usd: real("mint_vol_usd").notNull(),
  num_mints: integer("num_mints").notNull(),
  kind: text("kind", { enum: ["solana", "ethereum", "sui"] }).notNull(),
});

export const collectionRelationShip = relations(collections, ({ many }) => ({
  attributes: many(collectionAttributes),
  items: many(items),
  trending: many(trending),
  minting: many(minting),
}));

export const trendingRelationShip = relations(trending, ({ one }) => ({
  collections: one(collections, {
    fields: [trending.collection_id],
    references: [collections.id],
  }),
}));

export const mintingRelationship = relations(minting, ({ one }) => ({
  collections: one(collections, {
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
}));
