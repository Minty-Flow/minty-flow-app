import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { drizzleDb } from "../db"
import { accounts, categories, tags, transactions } from "../schema"

export function useDatabaseChangeSignal(): string {
  const tx = useLiveQuery(
    drizzleDb
      .select({ id: transactions.id, updatedAt: transactions.updatedAt })
      .from(transactions),
  )
  const account = useLiveQuery(
    drizzleDb
      .select({ id: accounts.id, updatedAt: accounts.updatedAt })
      .from(accounts),
  )
  const category = useLiveQuery(
    drizzleDb
      .select({ id: categories.id, updatedAt: categories.updatedAt })
      .from(categories),
  )
  const tag = useLiveQuery(
    drizzleDb.select({ id: tags.id, updatedAt: tags.updatedAt }).from(tags),
  )

  return [
    tx.updatedAt?.getTime() ?? 0,
    account.updatedAt?.getTime() ?? 0,
    category.updatedAt?.getTime() ?? 0,
    tag.updatedAt?.getTime() ?? 0,
  ].join(":")
}
