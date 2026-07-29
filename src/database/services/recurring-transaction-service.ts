import { and, count, eq } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { recurringTransactions, transactions } from "~/database/drizzle/schema"
import { runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  RecurringEditPayload,
  TransactionFormValues,
} from "~/schemas/transactions.schema"
import type { TransactionSubType } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { assertMinorUnits } from "~/utils/money"
import { nextAbsoluteOccurrence } from "~/utils/recurrence"

// ── Row types ─────────────────────────────────────────────────────────────────

interface RowRecurring {
  id: string
  json_transaction_template: string
  transfer_to_account_id: string | null
  range: string
  rules: string
  last_generated_transaction_date: string | null
  disabled: number // 0 | 1
  created_at: string
}

const recurringSelection = {
  id: recurringTransactions.id,
  json_transaction_template: recurringTransactions.jsonTransactionTemplate,
  transfer_to_account_id: recurringTransactions.transferToAccountId,
  range: recurringTransactions.range,
  rules: recurringTransactions.rules,
  last_generated_transaction_date:
    recurringTransactions.lastGeneratedTransactionDate,
  disabled: recurringTransactions.disabled,
  created_at: recurringTransactions.createdAt,
}

interface RecurringTimeRange {
  from: number // Unix ms
  to: number // Unix ms
}

export interface RecurringTransactionTemplate {
  id: string
  amount: number
  type: string
  accountId: string
  categoryId: string | null
  title: string | null
  description: string | null
  subtype: TransactionSubType | null
  tags: string[] | null
  extra: Record<string, string> | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseTemplate(row: RowRecurring): RecurringTransactionTemplate {
  try {
    const template = JSON.parse(row.json_transaction_template) as Omit<
      RecurringTransactionTemplate,
      "id"
    >
    return { id: row.id, ...template }
  } catch {
    return {
      id: row.id,
      amount: 0,
      type: "expense",
      accountId: "",
      categoryId: null,
      title: null,
      description: null,
      subtype: null,
      tags: null,
      extra: null,
    }
  }
}

function parseTimeRange(row: RowRecurring): RecurringTimeRange {
  try {
    return JSON.parse(row.range) as RecurringTimeRange
  } catch {
    return { from: 0, to: 0 }
  }
}

function parseRules(row: RowRecurring): string[] {
  try {
    return JSON.parse(row.rules) as string[]
  } catch {
    return []
  }
}

async function getInitialDateMs(txId: string): Promise<number> {
  const row = drizzleDb
    .select({
      extra: transactions.extra,
      transaction_date: transactions.transactionDate,
    })
    .from(transactions)
    .where(eq(transactions.id, txId))
    .get()
  if (!row) return 0
  if (row.extra) {
    try {
      const extra = JSON.parse(row.extra) as Record<string, string>
      const raw = extra.recurringInitialDate
      if (raw) {
        const n = parseInt(raw, 10)
        if (!Number.isNaN(n)) return n
      }
    } catch {
      // ignore
    }
  }
  return new Date(row.transaction_date).getTime()
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

interface CreateRecurringRuleInput {
  amount: number
  type: string
  accountId: string
  categoryId: string | null
  title: string | null
  description: string | null
  subtype: TransactionSubType | null
  tags: string[] | null
  range: { from: number; to: number }
  rules: string[]
  transferToAccountId?: string | null
}

export async function createRecurringRule(
  data: CreateRecurringRuleInput,
): Promise<string> {
  assertMinorUnits(data.amount)
  const id = generateId()
  const now = new Date().toISOString()

  const template: Omit<RecurringTransactionTemplate, "id"> = {
    amount: data.amount,
    type: data.type,
    accountId: data.accountId,
    categoryId: data.categoryId,
    title: data.title,
    description: data.description,
    subtype: data.subtype,
    tags: data.tags,
    extra: null,
  }

  await runInTransaction("recurring.create", (db) => {
    db.insert(recurringTransactions)
      .values({
        id,
        jsonTransactionTemplate: JSON.stringify(template),
        transferToAccountId: data.transferToAccountId ?? null,
        range: JSON.stringify(data.range),
        rules: JSON.stringify(data.rules),
        lastGeneratedTransactionDate: null,
        disabled: 0,
        createdAt: now,
      })
      .run()
  })

  // Immediately sync so the first instance is generated
  await synchronizeAllRecurringTransactions()

  return id
}

export async function disableRecurringRule(ruleId: string): Promise<void> {
  await runInTransaction("recurring.disable", (db) => {
    db.update(recurringTransactions)
      .set({ disabled: 1 })
      .where(eq(recurringTransactions.id, ruleId))
      .run()
  })
}

type RecurringRuleTemplateUpdate = Partial<{
  amount: number
  title: string | null
  description: string | null
  categoryId: string | null
  accountId: string
  type: string
}>

export async function updateRecurringRuleTemplate(
  ruleId: string,
  fields: RecurringRuleTemplateUpdate,
): Promise<void> {
  if (fields.amount !== undefined) assertMinorUnits(fields.amount)
  const rule = drizzleDb
    .select(recurringSelection)
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, ruleId))
    .get()
  if (!rule) throw new Error(`Recurring rule ${ruleId} not found`)

  const template = parseTemplate(rule)
  const merged: RecurringTransactionTemplate = {
    ...template,
    ...(fields.amount !== undefined && { amount: fields.amount }),
    ...(fields.title !== undefined && { title: fields.title }),
    ...(fields.description !== undefined && {
      description: fields.description,
    }),
    ...(fields.categoryId !== undefined && { categoryId: fields.categoryId }),
    ...(fields.accountId !== undefined && { accountId: fields.accountId }),
    ...(fields.type !== undefined && { type: fields.type }),
  }

  await runInTransaction("recurring.updateTemplate", (db) => {
    db.update(recurringTransactions)
      .set({ jsonTransactionTemplate: JSON.stringify(merged) })
      .where(eq(recurringTransactions.id, ruleId))
      .run()
  })
}

export type RecurringEditScope = "this" | "this_and_future"
export type RecurringDeleteScope = "this" | "all" | "this_and_future"

export async function applyRecurringEditScope({
  scope,
  transactionId,
  transactionDate,
  ruleId,
  payload,
}: {
  scope: RecurringEditScope
  transactionId: string
  transactionDate: Date
  ruleId: string
  payload: RecurringEditPayload
}): Promise<void> {
  const { detachFromRule, updateFutureRecurringInstances, updateTransaction } =
    await import("./ledger-service")

  if (scope === "this") {
    await detachFromRule(transactionId)
    await updateTransaction(transactionId, payload)
    return
  }

  await updateFutureRecurringInstances(ruleId, transactionDate, payload)
  await updateRecurringRuleTemplate(ruleId, {
    amount: payload.amount,
    title: payload.title,
    categoryId: payload.categoryId,
    accountId: payload.accountId,
    type: payload.type,
  })
  await updateTransaction(transactionId, payload)
}

export async function applyRecurringDeleteScope({
  scope,
  transactionId,
  transactionDate,
  ruleId,
}: {
  scope: RecurringDeleteScope
  transactionId: string
  transactionDate: Date
  ruleId: string
}): Promise<void> {
  const {
    deleteAllRecurringInstances,
    deleteFutureRecurringInstances,
    deleteTransaction,
  } = await import("./ledger-service")

  switch (scope) {
    case "this":
      await deleteTransaction(transactionId)
      return
    case "all":
      await deleteAllRecurringInstances(ruleId)
      await disableRecurringRule(ruleId)
      return
    case "this_and_future":
      await deleteFutureRecurringInstances(ruleId, transactionDate)
      await disableRecurringRule(ruleId)
      return
  }
}

// ── Sync ──────────────────────────────────────────────────────────────────────

/* Concurrency lock — prevents parallel sync from creating duplicates. */
let syncRunning = false

async function synchronizeRecurringTransaction(
  ruleId: string,
  anchor: Date = new Date(),
): Promise<void> {
  /**
   * Safety valve:
   * We want to fully catch up normal offline periods (days/months),
   * but still protect against pathological cases such as a bad rule
   * generating an enormous number of occurrences.
   */
  const MAX_CATCH_UP_OCCURRENCES = 365

  const rule = drizzleDb
    .select(recurringSelection)
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, ruleId))
    .get()

  if (!rule || rule.disabled) return

  try {
    const range = parseTimeRange(rule)
    const rules = parseRules(rule)

    /**
     * Cursor represents the most recently generated occurrence.
     * We advance it after every successful generation.
     */
    let lastGenerated = rule.last_generated_transaction_date
      ? new Date(rule.last_generated_transaction_date)
      : null

    let processed = 0

    while (processed < MAX_CATCH_UP_OCCURRENCES) {
      // ONE-AHEAD POLICY:
      // If we've already generated up to (or beyond) the anchor,
      // there is nothing left to do.
      if (lastGenerated && lastGenerated.getTime() >= anchor.getTime()) {
        return
      }

      const fromDate = new Date(range.from)

      /**
       * If we've never generated anything, start from:
       * - the rule start date
       * - or "now" (anchor)
       * whichever is earlier.
       */
      const nextAnchor = lastGenerated
        ? lastGenerated
        : new Date(Math.min(anchor.getTime(), fromDate.getTime()))

      const nextOccurrence = nextAbsoluteOccurrence(rules, range, nextAnchor)

      if (!nextOccurrence) return

      /**
       * Defensive guard:
       * next occurrence must always move forward.
       */
      if (
        lastGenerated &&
        nextOccurrence.getTime() <= lastGenerated.getTime()
      ) {
        return
      }

      // ------------------------------------------------------------------
      // Effective-last protection
      //
      // Transactions may survive edits/deletes and still contain the
      // original recurringInitialDate. We use the latest generated
      // occurrence across all related transactions as an additional
      // duplicate-prevention mechanism.
      // ------------------------------------------------------------------

      const relatedTxIds = drizzleDb
        .select({ id: transactions.id })
        .from(transactions)
        .where(
          and(
            eq(transactions.recurringId, ruleId),
            eq(transactions.isDeleted, 0),
          ),
        )
        .all()

      if (relatedTxIds.length > 0) {
        const initialDates = await Promise.all(
          relatedTxIds.map((r) => getInitialDateMs(r.id)),
        )

        const effectiveLastMs = Math.max(...initialDates)

        if (nextOccurrence.getTime() <= effectiveLastMs) {
          return
        }
      }

      const nextTs = nextOccurrence.getTime()
      const nextIso = nextOccurrence.toISOString()

      // ------------------------------------------------------------------
      // Exact timestamp duplicate check
      // ------------------------------------------------------------------

      const alreadyExists = drizzleDb
        .select({ cnt: count() })
        .from(transactions)
        .where(
          and(
            eq(transactions.recurringId, ruleId),
            eq(transactions.transactionDate, nextIso),
            eq(transactions.isDeleted, 0),
          ),
        )
        .get()

      if ((alreadyExists?.cnt ?? 0) > 0) {
        await runInTransaction("recurring.updateLastGenerated", (db) => {
          db.update(recurringTransactions)
            .set({ lastGeneratedTransactionDate: nextIso })
            .where(eq(recurringTransactions.id, ruleId))
            .run()
        })

        lastGenerated = nextOccurrence
        processed++
        continue
      }

      const template = parseTemplate(rule)
      const isTransfer = !!rule.transfer_to_account_id

      /**
       * Future occurrences are created as pending.
       * Past occurrences are created as normal transactions.
       */
      const isPending = nextTs > anchor.getTime()

      const extra: Record<string, string> = {
        ...(template.extra ?? {}),
        recurringId: ruleId,
        recurringInitialDate: String(nextTs),
      }

      // ------------------------------------------------------------------
      // Create transaction/transfer and advance cursor atomically.
      // ------------------------------------------------------------------

      if (!isTransfer) {
        const txData: TransactionFormValues = {
          amount: template.amount,
          type: template.type as "expense" | "income" | "transfer",
          transactionDate: nextOccurrence,
          accountId: template.accountId,
          categoryId: template.categoryId ?? undefined,
          title: template.title,
          description: template.description,
          subtype: template.subtype,
          tags: template.tags ?? [],
          recurringId: ruleId,
          extra,
          isPending,
        }

        const { createTransaction } = await import("./ledger-service")

        await createTransaction(txData)
      } else {
        const toAccountId = rule.transfer_to_account_id

        if (!toAccountId) {
          throw new Error("Recurring transfer missing transferToAccountId")
        }

        const { createTransfer } = await import("./ledger-service")

        await createTransfer(
          {
            fromAccountId: template.accountId,
            toAccountId,
            amount: template.amount,
            transactionDate: nextOccurrence,
            title: template.title ?? undefined,
            notes: template.description ?? undefined,
          },
          {
            recurringId: ruleId,
            isPending,
            subtype: template.subtype ?? null,
            extra,
          },
        )
      }

      await runInTransaction("recurring.updateLastGenerated", (db) => {
        db.update(recurringTransactions)
          .set({ lastGeneratedTransactionDate: nextIso })
          .where(eq(recurringTransactions.id, ruleId))
          .run()
      })

      // Advance cursor and continue catch-up.
      lastGenerated = nextOccurrence
      processed++
    }

    logger.warn("[RecurringSync] catch-up safety limit reached", {
      ruleId,
      processed,
      limit: MAX_CATCH_UP_OCCURRENCES,
    })
  } catch (err) {
    logger.error(
      "[RecurringSync] failed to synchronize recurring transaction",
      {
        ruleId,
        error: err instanceof Error ? err.message : String(err),
      },
    )
  }
}

/**
 * Runs synchronizeRecurringTransaction for every active (non-disabled) rule.
 * Module-level lock prevents concurrent sync passes from creating duplicates.
 */
export async function synchronizeAllRecurringTransactions(
  anchor: Date = new Date(),
): Promise<void> {
  if (syncRunning) return
  syncRunning = true

  try {
    const rules = drizzleDb
      .select(recurringSelection)
      .from(recurringTransactions)
      .where(eq(recurringTransactions.disabled, 0))
      .all()
    for (const rule of rules) {
      await synchronizeRecurringTransaction(rule.id, anchor)
    }
  } finally {
    syncRunning = false
  }
}

export async function findRecurringById(
  id: string,
): Promise<RecurringTransactionTemplate | null> {
  const row = drizzleDb
    .select(recurringSelection)
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, id))
    .get()
  return row ? parseTemplate(row) : null
}
