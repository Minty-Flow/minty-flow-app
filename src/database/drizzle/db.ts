import { drizzle } from "drizzle-orm/expo-sqlite"

import { getDb } from "~/database/db"

import * as schema from "./schema"

export const drizzleDb = drizzle(getDb(), { schema })
export const expoDb = drizzleDb.$client
