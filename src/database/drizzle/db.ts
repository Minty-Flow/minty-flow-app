import { drizzle } from "drizzle-orm/expo-sqlite"

import { getDb } from "~/database/db"

import * as schema from "./schema"

function createDrizzleDb() {
  return drizzle(getDb(), { schema })
}

export let drizzleDb = createDrizzleDb()
export let expoDb = drizzleDb.$client

export function resetDrizzleDb(): void {
  drizzleDb = createDrizzleDb()
  expoDb = drizzleDb.$client
}
