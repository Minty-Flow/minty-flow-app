import { asc, eq } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { transactionRules } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  RuleMatchField,
  RuleMatchType,
  TransactionRule,
} from "~/types/transaction-rules"

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
