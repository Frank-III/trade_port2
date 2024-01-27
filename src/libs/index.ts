import { db } from "./db";
import { eq } from "drizzle-orm";
import { trending } from "./db/schema";

// await migrate(db, { migrationsFolder: "drizzle" });

// await sqlite.close();

const res = await db.query.trending.findMany({
  where: eq(trending.kind, "solana"),
  with: {
    collections: true,
  },
  limit: 20,
  offset: 0,
});

console.log(res);
