CREATE TABLE `AttributeKinds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`attribute_id` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `CollectionAttributes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collection_id` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Collections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`supply` real NOT NULL,
	`verified` integer NOT NULL,
	`twitter` text,
	`website` text
);
--> statement-breakpoint
CREATE TABLE `ItemAttributes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`kind_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collection_id` integer NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`lastBid` real NOT NULL,
	`lastSale` real NOT NULL,
	`tokenId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Minting` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collection_id` integer NOT NULL,
	`launched` integer NOT NULL,
	`mint_price` real NOT NULL,
	`floor` real NOT NULL,
	`mint_vol` real NOT NULL,
	`mint_vol_usd` real NOT NULL,
	`num_mints` integer NOT NULL,
	`kind` text NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `Collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Trending` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collection_id` integer NOT NULL,
	`floor` real NOT NULL,
	`market_cap` real NOT NULL,
	`volume` real NOT NULL,
	`volume_usd` real NOT NULL,
	`sales` integer NOT NULL,
	`average` real NOT NULL,
	`kind` text NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `Collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_attribute_id` ON `AttributeKinds` (`attribute_id`);--> statement-breakpoint
CREATE INDEX `idx_collection_id` ON `CollectionAttributes` (`collection_id`);--> statement-breakpoint
CREATE INDEX `idx_item_id` ON `ItemAttributes` (`item_id`);--> statement-breakpoint
CREATE INDEX `idx_kind_id` ON `ItemAttributes` (`kind_id`);