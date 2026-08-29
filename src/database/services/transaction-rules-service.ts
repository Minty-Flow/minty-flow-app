import { and, asc, eq, isNull, ne } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import {
  categories,
  transactionRules,
  transactions,
} from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  RuleMatchField,
  RuleMatchType,
  TransactionRule,
} from "~/types/transaction-rules"
import { applyRules } from "~/utils/transaction-rules"

function parseTagIds(raw: string | null): string[] | null {
  if (!raw) return null
  try {
    const arr = JSON.parse(raw) as unknown
    return Array.isArray(arr) ? (arr as string[]) : null
  } catch {
    return null
  }
}

function mapRow(row: typeof transactionRules.$inferSelect): TransactionRule {
  return {
    id: row.id,
    matchField: row.matchField as RuleMatchField,
    matchType: row.matchType as RuleMatchType,
    matchValue: row.matchValue,
    setCategoryId: row.setCategoryId,
    setSubtype: row.setSubtype,
    setTagIds: parseTagIds(row.setTagIds),
    priority: row.priority,
    isActive: !!row.isActive,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }
}

/** category id → type, so rules only apply a category to a matching txn kind. */
export function categoryTypeMap(): Map<string, "expense" | "income"> {
  const rows = drizzleDb
    .select({ id: categories.id, type: categories.type })
    .from(categories)
    .all()
  return new Map(rows.map((r) => [r.id, r.type as "expense" | "income"]))
}

/** Synchronous read for the ledger service to consult at transaction time. */
export function listTransactionRules(): TransactionRule[] {
  return drizzleDb
    .select()
    .from(transactionRules)
    .orderBy(asc(transactionRules.priority))
    .all()
    .map(mapRow)
}

export interface CreateRuleInput {
  matchField: RuleMatchField
  matchType: RuleMatchType
  matchValue: string
  setCategoryId?: string | null
  setSubtype?: string | null
  setTagIds?: string[] | null
  isActive?: boolean
}

export async function createTransactionRule(
  input: CreateRuleInput,
): Promise<string> {
  const id = generateId()
  const now = new Date().toISOString()

  await runInTransaction("transactionRule.create", (db) => {
    const maxPriority =
      db
        .select({ priority: transactionRules.priority })
        .from(transactionRules)
        .orderBy(asc(transactionRules.priority))
        .all()
        .at(-1)?.priority ?? -1

    db.insert(transactionRules)
      .values({
        id,
        matchField: input.matchField,
        matchType: input.matchType,
        matchValue: input.matchValue.trim(),
        setCategoryId: input.setCategoryId ?? null,
        setSubtype: input.setSubtype ?? null,
        setTagIds:
          input.setTagIds && input.setTagIds.length > 0
            ? JSON.stringify(input.setTagIds)
            : null,
        priority: maxPriority + 1,
        isActive: input.isActive === false ? 0 : 1,
        createdAt: now,
        updatedAt: now,
      })
      .run()
  })

  return id
}

export type UpdateRuleInput = Partial<CreateRuleInput>

export async function updateTransactionRule(
  id: string,
  input: UpdateRuleInput,
): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("transactionRule.update", (db) => {
    db.update(transactionRules)
      .set({
        ...(input.matchField !== undefined
          ? { matchField: input.matchField }
          : {}),
        ...(input.matchType !== undefined
          ? { matchType: input.matchType }
          : {}),
        ...(input.matchValue !== undefined
          ? { matchValue: input.matchValue.trim() }
          : {}),
        ...(input.setCategoryId !== undefined
          ? { setCategoryId: input.setCategoryId ?? null }
          : {}),
        ...(input.setSubtype !== undefined
          ? { setSubtype: input.setSubtype ?? null }
          : {}),
        ...(input.setTagIds !== undefined
          ? {
              setTagIds:
                input.setTagIds && input.setTagIds.length > 0
                  ? JSON.stringify(input.setTagIds)
                  : null,
            }
          : {}),
        ...(input.isActive !== undefined
          ? { isActive: input.isActive ? 1 : 0 }
          : {}),
        updatedAt: now,
      })
      .where(eq(transactionRules.id, id))
      .run()
  })
}

export async function setTransactionRuleActive(
  id: string,
  isActive: boolean,
): Promise<void> {
  await updateTransactionRule(id, { isActive })
}

export async function deleteTransactionRule(id: string): Promise<void> {
  await runInTransaction("transactionRule.delete", (db) => {
    db.delete(transactionRules).where(eq(transactionRules.id, id)).run()
  })
}

/** Persist a new order; `orderedIds[0]` becomes the highest-priority rule. */
export async function reorderTransactionRules(
  orderedIds: string[],
): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("transactionRule.reorder", (db) => {
    orderedIds.forEach((id, index) => {
      db.update(transactionRules)
        .set({ priority: index, updatedAt: now })
        .where(eq(transactionRules.id, id))
        .run()
    })
  })
}

/** Non-transfer, non-deleted transactions that have no category yet. */
export function countUncategorisedTransactions(): number {
  return drizzleDb
    .select({ id: transactions.id })
    .from(transactions)
    .where(
      and(
        isNull(transactions.categoryId),
        eq(transactions.isDeleted, 0),
        ne(transactions.type, "transfer"),
      ),
    )
    .all().length
}

/**
 * Run the active rules over existing uncategorised transactions. Fills
 * category (and subtype) only — never tags, never a transfer, never an
 * already-categorised row. Explicit and user-triggered. Returns the count
 * of rows changed.
 */
export async function applyRulesToBacklog(): Promise<number> {
  const rules = listTransactionRules()
  if (rules.length === 0) return 0

  const catTypes = categoryTypeMap()
  const candidates = drizzleDb
    .select({
      id: transactions.id,
      title: transactions.title,
      description: transactions.description,
      subtype: transactions.subtype,
      type: transactions.type,
    })
    .from(transactions)
    .where(
      and(
        isNull(transactions.categoryId),
        eq(transactions.isDeleted, 0),
        ne(transactions.type, "transfer"),
      ),
    )
    .all()

  const updates = candidates
    .map((row) => {
      const patch = applyRules(
        {
          title: row.title,
          description: row.description,
          categoryId: null,
          subtype: row.subtype,
          tags: [],
          isTransfer: false,
          type: row.type as "expense" | "income",
        },
        rules,
        catTypes,
      )
      return patch.categoryId
        ? { id: row.id, categoryId: patch.categoryId, subtype: patch.subtype }
        : null
    })
    .filter((u): u is NonNullable<typeof u> => u !== null)

  if (updates.length === 0) return 0

  const now = new Date().toISOString()
  await runInTransaction("transactionRule.applyBacklog", (db) => {
    for (const u of updates) {
      db.update(transactions)
        .set({
          categoryId: u.categoryId,
          categorySource: "rule",
          ...(u.subtype ? { subtype: u.subtype } : {}),
          updatedAt: now,
        })
        .where(eq(transactions.id, u.id))
        .run()
    }
  })

  return updates.length
}
