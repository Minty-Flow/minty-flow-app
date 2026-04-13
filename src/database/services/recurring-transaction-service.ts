import { Q } from "@nozbe/watermelondb"

import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { logger } from "~/utils/logger"
import { nextAbsoluteOccurrence } from "~/utils/recurrence"

import { database } from "../index"
import type RecurringTransactionModel from "../models/recurring-transaction"
import type { RecurringTransactionTemplate } from "../models/recurring-transaction"
import type TransactionModel from "../models/transaction"
import { createTransactionWriter } from "./transaction-service"
import { createTransferWriter } from "./transfer-service"

/**
 * Scope for recurring edit/delete, matching flow project's RecurringUpdateMode.
 * - current: only this occurrence
 * - thisAndFuture: this occurrence and all future ones (by recurringInitialDate)
 * - all: all occurrences in the series
 */

function getRecurringTransactionsCollection() {
  return database.get<RecurringTransactionModel>("recurring_transactions")
}

/** Find a recurring template by WatermelonDB id. Returns null when not found. */
export async function findRecurringById(
  id: string,
): Promise<RecurringTransactionModel | null> {
  try {
    return await getRecurringTransactionsCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Active recurrings: disabled is null or false.
 * Matches Flutter's `disabled.isNull().or(disabled.notEquals(true))`.
 */
async function getActiveRecurringTransactions(): Promise<
  RecurringTransactionModel[]
> {
  return getRecurringTransactionsCollection()
    .query(Q.where("disabled", Q.notEq(true)))
    .fetch()
}

function getInitialDateMs(t: TransactionModel): number {
  const raw = t.extra?.recurringInitialDate
  if (!raw) return t.transactionDate.getTime()
  const n = Number.parseInt(raw, 10)
  return Number.isNaN(n) ? t.transactionDate.getTime() : n
}

/**
 * Related transactions for a recurring template (by recurring_id column).
 * Excludes soft-deleted (trashed) transactions. Sorted by recurringInitialDate asc.
 */
async function getRelatedTransactionsByRecurringId(
  recurringId: string,
): Promise<TransactionModel[]> {
  const transactions = await database
    .get<TransactionModel>("transactions")
    .query(Q.where("recurring_id", recurringId), Q.where("is_deleted", false))
    .fetch()
  transactions.sort((a, b) => getInitialDateMs(a) - getInitialDateMs(b))
  return transactions
}

/**
 * Generates the next due transaction instance for a single recurring rule and
 * recursively catches up any missed occurrences up to `anchor` (one-ahead policy).
 * Skips disabled rules and guards against infinite loops with a max recursion depth of 500.
 *
 * @param recurring - The recurring template whose next instance should be generated.
 * @param anchor - "Now" reference date; defaults to the current wall-clock time.
 * @param depth - Internal recursion counter used for the depth limit — callers should omit this.
 */
export async function synchronizeRecurringTransaction(
  recurring: RecurringTransactionModel,
  anchor: Date = new Date(),
  depth = 0,
): Promise<void> {
  if (depth > 500) {
    logger.error(
      "[RecurringSync] depth limit reached — possible infinite loop",
      {
        recurringId: recurring.id,
      },
    )
    return
  }
  if (recurring.disabled) return

  try {
    const range = recurring.timeRange
    const rules = recurring.recurrenceRules
    const lastGenerated = recurring.lastGeneratedTransactionDate
    const fromDate = new Date(range.from)

    // ── ONE-AHEAD POLICY
    if (lastGenerated && lastGenerated.getTime() >= anchor.getTime()) return

    // ── Compute next-occurrence anchor
    const nextAnchor = lastGenerated
      ? lastGenerated
      : new Date(Math.min(anchor.getTime(), fromDate.getTime()))

    const nextOccurrence = nextAbsoluteOccurrence(rules, range, nextAnchor)
    if (!nextOccurrence) return

    // ── NO-DUPLICATE guard
    if (lastGenerated && nextOccurrence.getTime() <= lastGenerated.getTime())
      return

    // ── Effective-last from related transactions
    const related = await getRelatedTransactionsByRecurringId(recurring.id)
    const effectiveLast = related.length
      ? new Date(Math.max(...related.map(getInitialDateMs)))
      : null
    if (effectiveLast && nextOccurrence.getTime() <= effectiveLast.getTime())
      return

    // ── Idempotency: check existing transactions
    const nextTs = nextOccurrence.getTime()
    const alreadyExists =
      (await database
        .get<TransactionModel>("transactions")
        .query(
          Q.where("recurring_id", recurring.id),
          Q.where("transaction_date", nextTs),
          Q.where("is_deleted", false),
        )
        .fetchCount()) > 0
    if (alreadyExists) {
      await database.write(async () => {
        await recurring.update((r) => {
          r.lastGeneratedTransactionDate = nextOccurrence
        })
      })
      if (nextOccurrence.getTime() < anchor.getTime()) {
        await synchronizeRecurringTransaction(recurring, anchor, depth + 1)
      }
      return
    }

    const template = recurring.template
    const isTransfer = Boolean(recurring.transferToAccountId)
    const isPending = nextOccurrence.getTime() > anchor.getTime()

    const extra: Record<string, string> = {
      ...template.extra,
      recurringId: recurring.id,
      recurringInitialDate: String(nextTs),
    }

    const transactionData: TransactionFormValues = {
      amount: template.amount,
      type: template.type as "expense" | "income" | "transfer",
      transactionDate: nextOccurrence,
      accountId: template.accountId,
      categoryId: template.categoryId ?? undefined,
      title: template.title,
      description: template.description,
      subtype: template.subtype,
      tags: template.tags ?? [],
      recurringId: recurring.id,
      extra,
      isPending,
    }

    // ── SINGLE WRITE: create transaction/transfer + update lastGeneratedTransactionDate
    await database.write(async () => {
      if (!isTransfer) {
        await createTransactionWriter(transactionData)
      } else {
        const fromAccountId = template.accountId
        const toAccountId = recurring.transferToAccountId
        if (!toAccountId)
          throw new Error("Recurring transfer missing transferToAccountId")

        await createTransferWriter(
          {
            fromAccountId,
            toAccountId,
            amount: template.amount,
            transactionDate: nextOccurrence,
            title: template.title ?? undefined,
            notes: template.description ?? undefined,
          },
          {
            recurringId: recurring.id,
            isPending,
            subtype: template.subtype ?? null,
            extra,
          },
        )
      }

      await recurring.update((r) => {
        r.lastGeneratedTransactionDate = nextOccurrence
      })
    })

    // ── CATCH-UP recursion
    if (nextOccurrence.getTime() < anchor.getTime()) {
      await synchronizeRecurringTransaction(recurring, anchor, depth + 1)
    }
  } catch (e) {
    logger.error("Failed to synchronize recurring transaction", {
      recurringId: recurring.id,
      error: e instanceof Error ? e.message : String(e),
    })
  }
}

/* ------------------------------------------------------------------ */
/* Concurrency lock – prevents parallel sync runs from creating dupes  */
/* ------------------------------------------------------------------ */
/*
 * Why this lock exists:
 *   The sync can be triggered from multiple sources simultaneously — e.g. the
 *   root layout `useEffect` on mount AND an `AppState` "active" foreground event
 *   firing in quick succession. Without a guard, two concurrent sync passes would
 *   race through the same recurring rules and create duplicate transaction rows.
 *
 * How it works:
 *   `_syncRunning` is set to `true` at the start of a sync pass and reset to
 *   `false` in the `finally` block. Any call that arrives while the flag is `true`
 *   returns immediately (no-op). The flag is module-level, so it is shared across
 *   all callers within the same JS runtime.
 *
 * UX impact:
 *   Because `createRecurringRule` calls `synchronizeAllRecurringTransactions`
 *   immediately after persisting the new rule, a race is possible: if another sync
 *   is already in-flight when the user saves a new recurring rule, that call will
 *   no-op and the first instance of the new rule will **not** appear until the next
 *   time the app comes to the foreground and triggers a fresh sync. This is
 *   intentional — a missed instance on first-save is far less harmful than
 *   duplicate transactions caused by concurrent writes.
 */

let _syncRunning = false

/**
 * Runs {@link synchronizeRecurringTransaction} for every active (non-disabled) rule.
 *
 * **Concurrency lock**: a module-level `_syncRunning` flag prevents concurrent
 * sync passes. If this function is called while a previous invocation has not yet
 * finished, the new call **no-ops immediately** and returns `undefined`. The lock
 * is released in a `finally` block so it is always cleared even if an individual
 * rule sync throws.
 *
 * **UX note**: because `createRecurringRule` triggers this function right after
 * persisting the new rule, the first instance of a newly created rule may not be
 * visible until the next app foreground event if the lock happens to be held at
 * save time. This is a deliberate trade-off to prevent duplicate transactions.
 *
 * @param anchor - "Now" reference date passed through to each rule's sync call;
 *   defaults to the current wall-clock time.
 */
export async function synchronizeAllRecurringTransactions(
  anchor: Date = new Date(),
): Promise<void> {
  if (_syncRunning) return
  _syncRunning = true
  try {
    const list = await getActiveRecurringTransactions()
    for (const r of list) {
      await synchronizeRecurringTransaction(r, anchor)
    }
  } finally {
    _syncRunning = false
  }
}

interface CreateRecurringRuleInput {
  amount: number
  type: string
  accountId: string
  categoryId: string | null
  title: string | null
  description: string | null
  subtype: string | null
  tags: string[] | null
  /** Range start = first occurrence date; end = last (or far future). */
  range: { from: number; to: number }
  rules: string[]
}

/**
 * Create a recurring RULE only — no transaction is created.
 * The scheduler (synchronizeRecurringTransaction) will generate actual transaction
 * rows, including the first occurrence, when it runs (app open / foreground).
 * Fix for Bug #1: never create a transaction when user enables recurring — only the rule.
 */
export async function createRecurringRule(
  data: CreateRecurringRuleInput,
): Promise<RecurringTransactionModel> {
  const template: RecurringTransactionTemplate = {
    amount: data.amount,
    type: data.type,
    accountId: data.accountId,
    categoryId: data.categoryId ?? null,
    title: data.title ?? null,
    description: data.description ?? null,
    subtype: data.subtype ?? null,
    tags: data.tags ?? null,
    extra: null,
  }
  const rangeEncoded = JSON.stringify(data.range)
  const rulesEncoded = JSON.stringify(data.rules)

  let created: RecurringTransactionModel | null = null
  await database.write(async () => {
    const coll = getRecurringTransactionsCollection()
    created = await coll.create((r) => {
      r.jsonTransactionTemplate = JSON.stringify(template)
      r.transferToAccountId = null
      r.rangeEncoded = rangeEncoded
      r.rulesEncoded = rulesEncoded
      r.lastGeneratedTransactionDate = null
      r.disabled = false
    })
  })
  if (!created) throw new Error("Failed to create RecurringTransaction")
  const recurring = created as RecurringTransactionModel
  await synchronizeAllRecurringTransactions()
  return recurring
}

/**
 * Disable a recurring rule so no new instances are generated.
 * Used by DeleteRecurringModal after soft-deleting instances (all or this-and-future).
 */
export async function disableRecurringRule(ruleId: string): Promise<void> {
  const rule = await findRecurringById(ruleId)
  if (!rule) return
  await database.write(async () => {
    await rule.update((r) => {
      r.disabled = true
    })
  })
}

type RecurringRuleTemplateUpdate = Partial<{
  amount: number
  title: string | null
  description: string
  categoryId: string | null
  accountId: string
  type: string
}>

/**
 * Update the rule's transaction template (used for "this and future" edit).
 * New instances generated after this will use the updated values.
 */
export async function updateRecurringRuleTemplate(
  ruleId: string,
  fields: RecurringRuleTemplateUpdate,
): Promise<void> {
  const rule = await findRecurringById(ruleId)
  if (!rule) throw new Error(`Recurring rule ${ruleId} not found`)
  const template = rule.template
  const merged = {
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
  await database.write(async () => {
    await rule.update((r) => {
      r.jsonTransactionTemplate = JSON.stringify(merged)
    })
  })
}
