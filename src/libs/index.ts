import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

const sqlite = new Database("../../sqlite.db");
export const db = drizzle(sqlite);

// await migrate(db, { migrationsFolder: "drizzle" });

// await sqlite.close();
