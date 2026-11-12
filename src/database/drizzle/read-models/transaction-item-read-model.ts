import { and, desc, eq } from "drizzle-orm"

import { normalizeItemName } from "~/utils/string-utils"

import { drizzleDb } from "../db"
import { accounts, transactionItems, transactions } from "../schema"

export interface RecentItem {
  name: string
  /** Minor units, from the latest use of this name. */
  unitPrice: number
}

// shortcut: grouping scans the newest 500 item rows only; a name last used
// before that drops out of the recents. Group in SQL if that ever matters.
const SCAN_LIMIT = 500

/**
 * Item names used before in `currencyCode`, most used first (ties: newest
 * first), one per name, with the latest spelling and unit price. Trashed
 * transactions don't count.
 */
export function getRecentItems(currencyCode: string, limit = 8): RecentItem[] {
  const rows = drizzleDb
    .select({
      name: transactionItems.name,
      unitPrice: transactionItems.unitPrice,
    })
    .from(transactionItems)
    .innerJoin(
      transactions,
      eq(transactions.id, transactionItems.transactionId),
    )
    .innerJoin(accounts, eq(accounts.id, transactions.accountId))
    .where(
      and(
        eq(transactions.isDeleted, 0),
        eq(accounts.currencyCode, currencyCode),
      ),
    )
    .orderBy(
      desc(transactions.transactionDate),
      desc(transactions.createdAt),
      transactionItems.sortOrder,
    )
    .limit(SCAN_LIMIT)
    .all()

  // Rows come newest first, so the first row per name is its latest use.
  const byName = new Map<string, RecentItem & { uses: number }>()
  for (const row of rows) {
    const key = normalizeItemName(row.name)
    const seen = byName.get(key)
    if (seen) seen.uses += 1
    else byName.set(key, { ...row, uses: 1 })
  }
  // Stable sort: equal counts keep their newest-first order.
  return [...byName.values()]
    .sort((a, b) => b.uses - a.uses)
    .slice(0, limit)
    .map(({ name, unitPrice }) => ({ name, unitPrice }))
}
