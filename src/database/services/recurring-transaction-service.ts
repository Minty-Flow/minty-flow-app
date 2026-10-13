import { endOfDay } from "date-fns"
import { and, count, desc, eq } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { recurringTransactions, transactions } from "~/database/drizzle/schema"
import { type DbTransaction, runInTransaction } from "~/database/transaction"
import { generateId } from "~/database/utils/generate-id"
import type {
  RecurringEditPayload,
  TransactionFormValues,
} from "~/schemas/transactions.schema"
import type {
  Recurrence,
  TransactionKind,
  TransactionSubType,
} from "~/types/transactions"
import { logger } from "~/utils/logger"
import { assertMinorUnits } from "~/utils/money"
import {
  buildRRuleString,
  nextAbsoluteOccurrence,
  parseRecurrence,
} from "~/utils/recurrence"

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
  kind: TransactionKind
}

/** Template plus the raw scheduling columns, for the edit screen. */
export interface RecurringRuleDetails extends RecurringTransactionTemplate {
  rules: string[]
  range: RecurringTimeRange
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseTemplate(row: RowRecurring): RecurringTransactionTemplate {
  try {
    const template = JSON.parse(row.json_transaction_template) as Omit<
      RecurringTransactionTemplate,
      "id"
    >
    return { id: row.id, ...template, kind: template.kind ?? "repetitive" }
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
      kind: "repetitive",
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

/** Move a rule's cursor to `iso`, inside an open database transaction. */
function advanceCursor(db: DbTransaction, ruleId: string, iso: string): void {
  db.update(recurringTransactions)
    .set({ lastGeneratedTransactionDate: iso })
    .where(eq(recurringTransactions.id, ruleId))
    .run()
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
  kind: TransactionKind
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
    kind: data.kind,
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

async function disableRecurringRule(ruleId: string): Promise<void> {
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

async function updateRecurringRuleTemplate(
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

const FOREVER_MS = new Date(2099, 11, 31).getTime()

/**
 * ES-8 — rewrite a rule's recurrence (interval/unit) and/or its "until".
 * Keeps `range.from` (RS-2). Resets `last_generated_transaction_date` to the
 * latest live occurrence (past or future) so the next sync continues without
 * stalling. Handles future-dated edited instances by anchoring to the max of
 * all instances, preventing effectiveLast guard from pinning the cursor below
 * new-cadence occurrences. Never touches the template fields.
 */
async function updateRecurringRule(
  ruleId: string,
  opts: { recurrence: Recurrence; until: Date | null },
): Promise<void> {
  const rule = drizzleDb
    .select(recurringSelection)
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, ruleId))
    .get()
  if (!rule) throw new Error(`Recurring rule ${ruleId} not found`)

  const range = parseTimeRange(rule) // keeps range.from
  const untilEod = opts.until ? endOfDay(opts.until) : null
  const nextRange = {
    from: range.from,
    to: untilEod?.getTime() ?? FOREVER_MS,
  }
  const rrule = buildRRuleString({
    interval: opts.recurrence.interval,
    unit: opts.recurrence.unit,
    startDate: new Date(range.from),
    until: opts.until ?? null,
  })

  // Get the latest live instance (past or future) to anchor the cursor.
  // This prevents stalling when the edited instance is future-dated (pending).
  const lastLive = drizzleDb
    .select({ d: transactions.transactionDate })
    .from(transactions)
    .where(
      and(eq(transactions.recurringId, ruleId), eq(transactions.isDeleted, 0)),
    )
    .orderBy(desc(transactions.transactionDate))
    .get()

  await runInTransaction("recurring.updateRule", (db) => {
    db.update(recurringTransactions)
      .set({
        rules: JSON.stringify([rrule]),
        range: JSON.stringify(nextRange),
        lastGeneratedTransactionDate: lastLive?.d ?? null,
      })
      .where(eq(recurringTransactions.id, ruleId))
      .run()
  })

  await synchronizeAllRecurringTransactions()
}

export type RecurringEditScope = "this" | "this_and_future"
export type RecurringDeleteScope = "this" | "all" | "this_and_future"

export async function applyRecurringEditScope({
  scope,
  transactionId,
  transactionDate,
  ruleId,
  payload,
  recurrence,
  until,
}: {
  scope: RecurringEditScope
  transactionId: string
  transactionDate: Date
  ruleId: string
  payload: RecurringEditPayload
  recurrence?: Recurrence
  until?: Date | null
}): Promise<void> {
  const {
    deleteFutureRecurringInstances,
    detachFromRule,
    updateFutureRecurringInstances,
    updateTransaction,
  } = await import("./ledger-service")

  if (scope === "this") {
    await detachFromRule(transactionId)
    await updateTransaction(transactionId, payload)
    return
  }

  // Detect real cadence change by comparing incoming values against stored rule.
  // Field-only edits (amount/title/category only) must not trigger delete + regenerate.
  const storedRule = await findRecurringById(ruleId)
  const storedRec = storedRule
    ? parseRecurrence(storedRule.rules[0] ?? "")
    : null
  const incomingUntilMs = until ? endOfDay(until).getTime() : FOREVER_MS
  const recurrenceChanged =
    !!recurrence &&
    !!storedRec &&
    !!storedRule &&
    (recurrence.interval !== storedRec.interval ||
      recurrence.unit !== storedRec.unit ||
      incomingUntilMs !== storedRule.range.to)

  if (recurrenceChanged && recurrence) {
    // Delete forward instances FIRST when cadence changes.
    // Cutoff: fromDate = transactionDate + 1ms spares the edited instance.
    // deleteFutureRecurringInstances filters gte(transactionDate, fromDate),
    // so +1ms ensures the edited instance's timestamp is strictly less.
    const fromDate = new Date(transactionDate.getTime() + 1)
    await deleteFutureRecurringInstances(ruleId, fromDate)
  } else if (!recurrenceChanged) {
    // Pure field-only edit: update field values on future instances.
    const edited = drizzleDb
      .select({
        requiresManualConfirmation: transactions.requiresManualConfirmation,
      })
      .from(transactions)
      .where(eq(transactions.id, transactionId))
      .get()
    await updateFutureRecurringInstances(ruleId, transactionDate, payload, {
      dateShiftMs:
        payload.transactionDate.getTime() - transactionDate.getTime(),
      // Copy the flag only when the user changed it on the edited instance.
      applyManualConfirmation:
        !!edited &&
        payload.requiresManualConfirmation !== undefined &&
        (payload.requiresManualConfirmation ? 1 : 0) !==
          edited.requiresManualConfirmation,
    })
  }

  // Update template fields.
  await updateRecurringRuleTemplate(ruleId, {
    amount: payload.amount,
    title: payload.title,
    categoryId: payload.categoryId,
    accountId: payload.accountId,
    type: payload.type,
  })

  // Update recurrence/until if cadence changed.
  // With forward instances deleted, effectiveLast no longer stalls the sync.
  if (recurrenceChanged && recurrence) {
    await updateRecurringRule(ruleId, {
      recurrence,
      until: until ?? null,
    })
  }

  // Update the edited instance.
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

/*
 * Concurrency control — prevents parallel sync from creating duplicates.
 * `currentPass` is the pass running now; `queuedPass` is the single rerun that
 * callers arriving meanwhile share (see synchronizeAllRecurringTransactions).
 */
let currentPass: Promise<RecurringSyncFailure[]> | null = null
let queuedPass: Promise<RecurringSyncFailure[]> | null = null

/** A rule the sync turned off because it can never generate. */
export interface RecurringSyncFailure {
  ruleId: string
  title: string | null
}

/**
 * Whether a sync error will repeat on every sync: a broken reference or
 * constraint, or a transfer rule without a destination. Anything else (a busy
 * database, say) is left to retry.
 */
export function isPermanentRuleError(message: string): boolean {
  return /constraint failed|missing transferToAccountId/i.test(message)
}

async function synchronizeRecurringTransaction(
  ruleId: string,
  anchor: Date = new Date(),
): Promise<RecurringSyncFailure | null> {
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

  if (!rule || rule.disabled) return null

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
        return null
      }

      const fromDate = new Date(range.from)

      /**
       * If we've never generated anything, look from just before the rule
       * start date. `nextAbsoluteOccurrence` treats an anchor before the range
       * as inclusive, so the start date itself becomes the first occurrence.
       * Anchoring at the start date would skip it.
       */
      const nextAnchor = lastGenerated ?? new Date(fromDate.getTime() - 1)

      const nextOccurrence = nextAbsoluteOccurrence(rules, range, nextAnchor)

      if (!nextOccurrence) return null

      /**
       * Defensive guard:
       * next occurrence must always move forward.
       */
      if (
        lastGenerated &&
        nextOccurrence.getTime() <= lastGenerated.getTime()
      ) {
        return null
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
          // An instance for this slot, or a later one, already exists, so the
          // cursor is behind (an interrupted write, or a rewritten rule). Catch
          // it up and go on. Returning here would leave the cursor where it is
          // and the rule would never generate again.
          await runInTransaction("recurring.updateLastGenerated", (db) =>
            advanceCursor(db, ruleId, nextOccurrence.toISOString()),
          )
          lastGenerated = nextOccurrence
          processed++
          continue
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
        await runInTransaction("recurring.updateLastGenerated", (db) =>
          advanceCursor(db, ruleId, nextIso),
        )

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
      // Create the instance and advance the cursor in ONE database
      // transaction. Two separate writes left a window where the instance
      // existed but the cursor did not move, and the rule then stalled.
      // ------------------------------------------------------------------

      const { createTransactionInTx, createTransferInTx } = await import(
        "./ledger-service"
      )

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
          kind: template.kind,
        }

        await runInTransaction("recurring.generate", (db) => {
          createTransactionInTx(db, txData)
          advanceCursor(db, ruleId, nextIso)
        })
      } else {
        const toAccountId = rule.transfer_to_account_id

        if (!toAccountId) {
          throw new Error("Recurring transfer missing transferToAccountId")
        }

        await runInTransaction("recurring.generate", (db) => {
          createTransferInTx(
            db,
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
              kind: template.kind,
            },
          )
          advanceCursor(db, ruleId, nextIso)
        })
      }

      // Advance cursor and continue catch-up.
      lastGenerated = nextOccurrence
      processed++
    }

    logger.warn("[RecurringSync] catch-up safety limit reached", {
      ruleId,
      processed,
      limit: MAX_CATCH_UP_OCCURRENCES,
    })
    return null
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    logger.error(
      "[RecurringSync] failed to synchronize recurring transaction",
      { ruleId, error: message },
    )
    // A transient error (busy database) retries on the next sync. A rule that
    // can never generate would fail on every sync, so turn it off.
    if (!isPermanentRuleError(message)) return null
    try {
      await disableRecurringRule(ruleId)
    } catch (disableErr) {
      logger.error("[RecurringSync] failed to disable a failing rule", {
        ruleId,
        error:
          disableErr instanceof Error ? disableErr.message : String(disableErr),
      })
      return null
    }
    return { ruleId, title: parseTemplate(rule).title }
  }
}

async function runSyncPass(anchor: Date): Promise<RecurringSyncFailure[]> {
  const failures: RecurringSyncFailure[] = []
  const rules = drizzleDb
    .select(recurringSelection)
    .from(recurringTransactions)
    .where(eq(recurringTransactions.disabled, 0))
    .all()
  for (const rule of rules) {
    const failure = await synchronizeRecurringTransaction(rule.id, anchor)
    if (failure) failures.push(failure)
  }
  return failures
}

/**
 * Runs synchronizeRecurringTransaction for every active (non-disabled) rule.
 * Only one pass runs at a time, so parallel passes cannot create duplicates.
 *
 * A call that arrives while a pass is running waits for it and then runs one
 * more pass. The running pass loaded its rule list before the caller's change
 * (a rule just created, say), so it would otherwise miss it. Every call that
 * arrives meanwhile shares that one rerun.
 *
 * Returns the rules it turned off, so the caller can tell the user.
 */
export function synchronizeAllRecurringTransactions(
  anchor: Date = new Date(),
): Promise<RecurringSyncFailure[]> {
  if (currentPass) {
    // Rerun even if the running pass threw, and never leave a settled
    // promise behind in `queuedPass`.
    queuedPass ??= currentPass
      .catch(() => undefined)
      .then(() => {
        queuedPass = null
        return synchronizeAllRecurringTransactions(anchor)
      })
    return queuedPass
  }

  const pass: Promise<RecurringSyncFailure[]> = runSyncPass(anchor).finally(
    () => {
      if (currentPass === pass) currentPass = null
    },
  )
  currentPass = pass
  return pass
}

export async function findRecurringById(
  id: string,
): Promise<RecurringRuleDetails | null> {
  const row = drizzleDb
    .select(recurringSelection)
    .from(recurringTransactions)
    .where(eq(recurringTransactions.id, id))
    .get()
  if (!row) return null
  return {
    ...parseTemplate(row),
    rules: parseRules(row),
    range: parseTimeRange(row),
  }
}
