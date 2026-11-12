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
 * Item names used before in `currencyCode`, newest first, one per name, with
 * the latest spelling and unit price. Trashed transactions don't count.
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

  const seen = new Set<string>()
  const recent: RecentItem[] = []
  for (const row of rows) {
    const key = normalizeItemName(row.name)
    if (seen.has(key)) continue
    seen.add(key)
    recent.push(row)
    if (recent.length === limit) break
  }
  return recent
}
