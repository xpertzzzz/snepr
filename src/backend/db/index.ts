import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const dbUrl =
  typeof process !== "undefined" && process?.env?.DATABASE_URL
    ? process.env.DATABASE_URL
    : "";

export const connection: any =
  dbUrl && typeof window === "undefined"
    ? postgres(dbUrl, { prepare: false })
    : null;

export const db: any = connection ? drizzle(connection, { schema }) : null;
