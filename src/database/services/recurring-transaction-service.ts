import { Q } from "@nozbe/watermelondb"

import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { logger } from "~/utils/logger"
import { nextAbsoluteOccurrence } from "~/utils/recurrence"

import { database } from "../index"
import type RecurringTransactionModel from "../models/recurring-transaction"
import type { RecurringTransactionTemplate } from "../models/recurring-transaction"
import type TransactionModel from "../models/transaction"
import { createTransactionModel } from "./transaction-service"
import { createTransfer } from "./transfer-service"

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
 * Generate the next occurrence for a recurring template and save it.
 *
 * Port of Flutter's RecurringTransactionsService._synchronize():
 * - ONE-AHEAD POLICY: if lastGenerated >= anchor → stop (already have a future occurrence).
 * - NO-DUPLICATE: if nextOccurrence <= lastGenerated → stop.
 * - EFFECTIVE-LAST: double-check against related transactions (tag-based).
 * - CATCH-UP: if the generated occurrence is still in the past, recurse.
 */
async function synchronizeRecurringTransaction(
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

  // Flutter wraps the entire sync body in try-catch so one failure doesn't
  // break the entire sync loop.  Match that here.
  try {
    const range = recurring.timeRange
    const rules = recurring.recurrenceRules
    const lastGenerated = recurring.lastGeneratedTransactionDate
    const fromDate = new Date(range.from)

    // ── Flutter guard 1: ONE-AHEAD POLICY ────────────────────────────
    // If we already generated an occurrence at or past the anchor, we
    // have one future occurrence — stop.  This is the critical guard
    // that prevents generating 5-6 transactions when sync runs multiple
    // times.
    if (lastGenerated && lastGenerated.getTime() >= anchor.getTime()) {
      return
    }

    // ── Compute next-occurrence anchor (matches Flutter logic) ───────
    let nextAnchor: Date
    if (lastGenerated) {
      nextAnchor = lastGenerated
    } else {
      // No lastGenerated → first sync.  Use the earlier of (anchor,
      // range.from) so we can catch up missed past occurrences, matching
      // Flutter's min(anchor.date, range.from.date)
      const earlier = Math.min(anchor.getTime(), fromDate.getTime())
      nextAnchor = new Date(earlier)
    }

    const nextOccurrence = nextAbsoluteOccurrence(rules, range, nextAnchor)
    if (!nextOccurrence) return

    // ── Flutter guard 2: NO-DUPLICATE ────────────────────────────────
    // nextOccurrence must be strictly after lastGenerated.
    if (lastGenerated && nextOccurrence.getTime() <= lastGenerated.getTime()) {
      return
    }

    // ── Effective-last from related transactions ──────────────────────
    const related = await getRelatedTransactionsByRecurringId(recurring.id)
    const effectiveLast = related.length
      ? new Date(Math.max(...related.map(getInitialDateMs)))
      : null

    if (effectiveLast && nextOccurrence.getTime() <= effectiveLast.getTime())
      return

    // ── Idempotency (Bug #1): duplicate guard by (ruleId + date) ───────
    // Don't generate if a transaction already exists for this rule and date.
    const nextTs = nextOccurrence.getTime()
    const alreadyExists =
      (await database
        .get<TransactionModel>("transactions")
        .query(
          Q.where("recurring_id", recurring.id),
          Q.where("transaction_date", nextTs),
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

    // Future occurrences are always pending; past (backfill) are confirmed.
    // requireConfirmation only controls auto-confirm when time comes (auto-confirmation-service).
    const isPending = nextOccurrence.getTime() > anchor.getTime()

    const extra: Record<string, string> = {
      ...template.extra,
      recurringId: recurring.id,
      recurringInitialDate: String(nextTs),
    }

    if (!isTransfer) {
      const data: TransactionFormValues = {
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
      await createTransactionModel(data)
    } else {
      const fromAccountId = template.accountId
      const toAccountId = recurring.transferToAccountId
      if (!toAccountId)
        throw new Error("Recurring transfer missing transferToAccountId")
      await createTransfer(
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

    // ── Update lastGeneratedTransactionDate ──────────────────────────
    await database.write(async () => {
      await recurring.update((r) => {
        r.lastGeneratedTransactionDate = nextOccurrence
      })
    })

    // ── CATCH-UP: if the generated occurrence is still in the past,
    //    recurse to fill in the next one.  The ONE-AHEAD guard at the
    //    top will stop us once we've generated one at-or-past anchor. ──
    if (nextOccurrence.getTime() < anchor.getTime()) {
      await synchronizeRecurringTransaction(recurring, anchor, depth + 1)
    }
  } catch (e) {
    // Match Flutter: log and continue — don't break the sync loop.
    logger.error("Failed to synchronize recurring transaction", {
      recurringId: recurring.id,
      error: e instanceof Error ? e.message : String(e),
    })
  }
}

/* ------------------------------------------------------------------ */
/* Concurrency lock – prevents parallel sync runs from creating dupes  */
/* ------------------------------------------------------------------ */
/* Bug #2: Generator must only run from ONE place (e.g. root layout useEffect).
 * This lock guards against concurrent calls from AppState + any double-wiring. */

let _syncRunning = false

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
