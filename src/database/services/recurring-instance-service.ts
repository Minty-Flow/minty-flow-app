import { and, eq, gte, inArray } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { transactions } from "~/database/drizzle/schema"
import { getPartnerTxId } from "~/database/services/ledger-rows"
import {
  deleteTransactionInTx,
  updateTransactionInTx,
} from "~/database/services/ledger-service"
import { runInTransaction } from "~/database/transaction"
import type { RecurringEditPayload } from "~/schemas/transactions.schema"
import { assertMinorUnits } from "~/utils/money"

/** Live (non-deleted) transactions of a recurring rule, optionally from a date / pending only. */
function getRuleInstanceIds(
  ruleId: string,
  opts: { fromDate?: Date; pendingOnly?: boolean } = {},
): string[] {
  return drizzleDb
    .select({ id: transactions.id })
    .from(transactions)
    .where(
      and(
        eq(transactions.recurringId, ruleId),
        opts.fromDate
          ? gte(transactions.transactionDate, opts.fromDate.toISOString())
          : undefined,
        opts.pendingOnly ? eq(transactions.isPending, 1) : undefined,
        eq(transactions.isDeleted, 0),
      ),
    )
    .all()
    .map((row) => row.id)
}

/**
 * `keepPaid` spares confirmed instances: they are history the user already
 * lived, and deleting the schedule must not rewrite balances. `alsoId` is the
 * row the user explicitly deleted, which goes even when it is paid.
 */
export interface DeleteInstancesOptions {
  keepPaid?: boolean
  alsoId?: string
}

function pickInstanceIds(
  ruleId: string,
  { keepPaid = false, alsoId }: DeleteInstancesOptions,
  fromDate?: Date,
): string[] {
  const ids = getRuleInstanceIds(ruleId, { fromDate, pendingOnly: keepPaid })
  if (keepPaid && alsoId && !ids.includes(alsoId)) ids.push(alsoId)
  return ids
}

export async function deleteAllRecurringInstances(
  ruleId: string,
  opts: DeleteInstancesOptions = {},
): Promise<void> {
  const ids = pickInstanceIds(ruleId, opts)
  await runInTransaction("recurring.deleteAll", (db) => {
    for (const id of ids) deleteTransactionInTx(db, id)
  })
}

export async function deleteFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
  opts: DeleteInstancesOptions = {},
): Promise<void> {
  const ids = pickInstanceIds(ruleId, opts, fromDate)
  await runInTransaction("recurring.deleteFuture", (db) => {
    for (const id of ids) deleteTransactionInTx(db, id)
  })
}

export async function detachFromRule(id: string): Promise<void> {
  const now = new Date().toISOString()
  await runInTransaction("transaction.detach", (db) => {
    // A transfer is two rows under one rule; detaching one leg would leave the
    // other for a later "delete this and future" to remove on its own.
    const ids = [id]
    const partner = getPartnerTxId(id, db)
    if (partner) ids.push(partner.partnerId)
    // Older screens read `extra.recurringId`, so drop the copy kept there too.
    for (const row of db
      .select({ id: transactions.id, extra: transactions.extra })
      .from(transactions)
      .where(inArray(transactions.id, ids))
      .all()) {
      db.update(transactions)
        .set({
          recurringId: null,
          extra: withoutRuleKeys(row.extra),
          updatedAt: now,
        })
        .where(eq(transactions.id, row.id))
        .run()
    }
  })
}

function withoutRuleKeys(extra: string | null): string | null {
  if (!extra) return extra
  try {
    const parsed: unknown = JSON.parse(extra)
    if (typeof parsed !== "object" || parsed === null) return extra
    const {
      recurringId: _id,
      recurringInitialDate: _date,
      ...rest
    } = parsed as Record<string, unknown>
    return Object.keys(rest).length > 0 ? JSON.stringify(rest) : null
  } catch {
    return extra
  }
}

/**
 * Apply the edited fields to every pending instance of a rule from `fromDate`
 * on. Each instance keeps its own date; `dateShiftMs` moves all of them by the
 * same amount when the user changed the edited instance's date.
 *
 * Instances stay pending: `isPending` belongs to the edited instance, and
 * copying it would confirm future instances early. The manual-confirmation
 * flag is copied only when `applyManualConfirmation` is set.
 */
export async function updateFutureRecurringInstances(
  ruleId: string,
  fromDate: Date,
  payload: Omit<RecurringEditPayload, "transactionDate" | "isPending">,
  { dateShiftMs = 0, applyManualConfirmation = false } = {},
): Promise<void> {
  const rows = drizzleDb
    .select({
      id: transactions.id,
      transactionDate: transactions.transactionDate,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.recurringId, ruleId),
        gte(transactions.transactionDate, fromDate.toISOString()),
        eq(transactions.isPending, 1),
        eq(transactions.isDeleted, 0),
      ),
    )
    .all()
  if (payload.amount !== undefined) assertMinorUnits(payload.amount)
  await runInTransaction("recurring.updateFuture", (db) => {
    for (const { id, transactionDate } of rows) {
      updateTransactionInTx(db, id, {
        amount: payload.amount,
        type: payload.type,
        transactionDate:
          dateShiftMs === 0
            ? undefined
            : new Date(new Date(transactionDate).getTime() + dateShiftMs),
        categoryId: payload.categoryId,
        accountId: payload.accountId,
        title: payload.title,
        description: payload.description,
        requiresManualConfirmation: applyManualConfirmation
          ? payload.requiresManualConfirmation
          : undefined,
        tags: payload.tags,
        // Attachment URIs point at one file; sharing them would let deleting
        // one instance's attachment delete the file for every instance.
        extra: withoutAttachments(payload.extra),
        subtype: payload.subtype,
      })
    }
  })
}

function withoutAttachments(
  extra: RecurringEditPayload["extra"],
): RecurringEditPayload["extra"] {
  if (!extra || !("attachments" in extra)) return extra
  const { attachments: _attachments, ...rest } = extra
  return rest
}
