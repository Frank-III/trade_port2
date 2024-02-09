import "dotenv/config";
import * as sqliteSchema from "./schema";
import * as mysqlSchema from "./schema.mysql";

const dev_env = process.env.DEV_ENV || "DEV";
let db;

async function initializeDatabase() {
  if (dev_env === "DEV") {
    console.log("DEV ENV");
    const { drizzle } = await import("drizzle-orm/better-sqlite3");
    const Database = (await import("better-sqlite3")).default;
    const sqlite = new Database("sqlite.db");
    db = drizzle(sqlite, { schema: sqliteSchema, logger: false });
  } else if (dev_env === "TEST") {
    console.log("TEST ENV");
    const { drizzle } = await import("drizzle-orm/mysql2");
    const mysql = (await import("mysql2/promise")).default;
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "tradeport",
      // ...other connection options
    });
    db = drizzle(connection, { schema: mysqlSchema, logger: false });
  }
}

await initializeDatabase();

export { db };
