import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

//import and reexport all schemas
import * as mySchema from "./schema";

export const schema = { ...mySchema };

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });
