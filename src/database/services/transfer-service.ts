import { Q } from "@nozbe/watermelondb"

import type {
  CreateTransferParams,
  EditTransferFields,
} from "~/schemas/transactions.schema"

import { database } from "../index"
import type AccountModel from "../models/account"
import type TransactionModel from "../models/transaction"
import type TransferModel from "../models/transfer"

/* ------------------------------------------------------------------ */
/* UUID */
/* ------------------------------------------------------------------ */

/**
 * Coerces a number, Date, or undefined value to a Unix millisecond timestamp.
 * Returns `fallback` when `v` is undefined.
 */
function toDateMs(v: number | Date | undefined, fallback: number): number {
  if (v === undefined) return fallback
  return typeof v === "number" ? v : v.getTime()
}

/* ------------------------------------------------------------------ */
/* Collections */
/* ------------------------------------------------------------------ */

const transactionsCollection = () =>
  database.get<TransactionModel>("transactions")
const accountsCollection = () => database.get<AccountModel>("accounts")
const transfersCollection = () => database.get<TransferModel>("transfers")

/* ------------------------------------------------------------------ */
/* Paired row */
/* ------------------------------------------------------------------ */

/**
 * Given one half of a transfer, return the other half.
 */
export async function getPairedTransaction(
  transaction: TransactionModel,
): Promise<TransactionModel | null> {
  if (!transaction.transferId) return null

  const results = await transactionsCollection()
    .query(
      Q.where("transfer_id", transaction.transferId),
      Q.where("id", Q.notEq(transaction.id)),
      Q.where("is_deleted", false),
    )
    .fetch()

  return results[0] ?? null
}

/**
 * Get the conversion rate for a transfer transaction (either leg).
 * Prefers the transfers table; falls back to transaction.extra.conversionRate for legacy data.
 * Rate is always "to-currency per 1 from-currency" (same as Flutter); stored once on the
 * Transfer record, so either debit or credit transaction id yields the same rate.
 */
export async function getConversionRateForTransaction(
  transaction: TransactionModel,
): Promise<number | null> {
  if (!transaction.isTransfer) return null

  const transfers = transfersCollection()
  const byFrom = await transfers
    .query(Q.where("from_transaction_id", transaction.id))
    .fetch()
  const byTo = await transfers
    .query(Q.where("to_transaction_id", transaction.id))
    .fetch()
  const transfer = byFrom[0] ?? byTo[0]
  if (transfer) return transfer.conversionRate

  const extra = transaction.extra?.conversionRate
  if (extra != null) {
    const parsed = parseFloat(extra)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Create */
/* ------------------------------------------------------------------ */

/**
 * Create a transfer between two accounts.
 * Always creates exactly TWO transaction rows linked by shared transfer_id (debit row's id).
 * Uses prepareCreate + batch for one atomic write. Only creates Transfer record when cross-currency.
 */
interface RecurringTransferOptions {
  recurringId: string
  isPending: boolean
  subtype?: string | null
  extra?: Record<string, string> | null
}

/**
 * Writer body — must be called within a `database.write()` context.
 * Creates exactly two linked transaction rows (debit and credit) sharing a `transfer_id`,
 * updates both account balances, and—for cross-currency transfers—creates a `transfers`
 * record storing the conversion rate. All operations are submitted as a single atomic batch.
 *
 * @param params - Transfer creation parameters (accounts, amount, date, title, notes, rate).
 * @param recurringOptions - Optional recurring context (recurringId, isPending, subtype, extra).
 */
export async function createTransferWriter(
  {
    fromAccountId,
    toAccountId,
    amount,
    conversionRate,
    transactionDate = Date.now(),
    title = "Transfer",
    notes = null,
  }: CreateTransferParams,
  recurringOptions?: RecurringTransferOptions,
): Promise<void> {
  if (fromAccountId === toAccountId) {
    throw new Error("Cannot transfer to the same account.")
  }
  if (amount <= 0) {
    throw new Error("Transfer amount must be positive.")
  }

  const accounts = accountsCollection()
  const [fromAccount, toAccount] = await Promise.all([
    accounts.find(fromAccountId),
    accounts.find(toAccountId),
  ])

  const isCrossCurrency = fromAccount.currencyCode !== toAccount.currencyCode
  const creditAmount =
    isCrossCurrency && conversionRate != null && conversionRate > 0
      ? amount * conversionRate
      : amount

  const dateMs = toDateMs(
    transactionDate as number | Date | undefined,
    Date.now(),
  )
  const debitBalanceBefore = fromAccount.balance
  const creditBalanceBefore = toAccount.balance

  const transactions = transactionsCollection()
  const transfers = transfersCollection()

  const debit = transactions.prepareCreate((r) => {
    r.title = title ?? null
    r.amount = -amount
    r.transactionDate = new Date(dateMs)
    r.type = "transfer"
    r.isTransfer = true
    r.transferId = r.id
    r.accountId = fromAccountId
    r.relatedAccountId = toAccountId
    r.accountBalanceBefore = debitBalanceBefore
    r.isPending = recurringOptions?.isPending ?? false
    r.isDeleted = false
    r.description = notes ?? null
    r.categoryId = null
    r.extra = recurringOptions?.extra ?? null
    r.recurringId = recurringOptions?.recurringId ?? null
    r.hasAttachments = false
    r.subtype = recurringOptions?.subtype ?? null
    r.location = null
  })

  const credit = transactions.prepareCreate((r) => {
    r.title = title ?? null
    r.amount = creditAmount
    r.transactionDate = new Date(dateMs)
    r.type = "transfer"
    r.isTransfer = true
    r.transferId = debit.id
    r.accountId = toAccountId
    r.relatedAccountId = fromAccountId
    r.accountBalanceBefore = creditBalanceBefore
    r.isPending = recurringOptions?.isPending ?? false
    r.isDeleted = false
    r.description = notes ?? null
    r.categoryId = null
    r.extra = recurringOptions?.extra ?? null
    r.recurringId = recurringOptions?.recurringId ?? null
    r.hasAttachments = false
    r.subtype = recurringOptions?.subtype ?? null
    r.location = null
  })

  const updateFrom = fromAccount.prepareUpdate((a) => {
    a.balance = a.balance - amount
  })
  const updateTo = toAccount.prepareUpdate((a) => {
    a.balance = a.balance + creditAmount
  })

  const batchOps: Parameters<typeof database.batch>[0] = [
    debit,
    credit,
    updateFrom,
    updateTo,
  ]

  if (
    isCrossCurrency &&
    conversionRate != null &&
    conversionRate > 0 &&
    conversionRate !== 1
  ) {
    const transferRecord = transfers.prepareCreate((t) => {
      t.fromTransactionId = debit.id
      t.toTransactionId = credit.id
      t.fromAccountId = fromAccountId
      t.toAccountId = toAccountId
      t.conversionRate = conversionRate
    })
    batchOps.push(transferRecord)
  }

  await database.batch(...batchOps)
}

/**
 * Public wrapper for {@link createTransferWriter}.
 * Creates a transfer between two accounts inside a `database.write()` context.
 *
 * @param params - Transfer creation parameters.
 * @param recurringOptions - Optional recurring context for recurring transfer instances.
 */
export async function createTransfer(
  params: CreateTransferParams,
  recurringOptions?: RecurringTransferOptions,
): Promise<void> {
  return database.write(() => createTransferWriter(params, recurringOptions))
}

/* ------------------------------------------------------------------ */
/* Edit */
/* ------------------------------------------------------------------ */

/**
 * Writer body — must be called within a `database.write()` context.
 * Updates both legs of a transfer atomically using a single `database.batch()` call.
 * Accepts either the debit or credit row; the paired row is resolved internally.
 *
 * Balance adjustment uses a **delta-based** approach (not revert-and-reapply):
 *   - FROM account: balance += (oldDebitAmount - newDebitAmount)
 *   - TO account:   balance += (newCreditAmount - oldCreditAmount)
 * This avoids reading stale model state from multiple sequential update calls and
 * correctly preserves the effect of any other transactions on the same accounts.
 *
 * When from/to accounts change, the old accounts are undone and the new accounts
 * are adjusted — all in the same atomic batch.
 *
 * @param transaction - Either leg of the existing transfer.
 * @param fields - The fields to update on both legs (amount, accounts, date, title, notes, rate).
 */
export async function editTransferWriter(
  transaction: TransactionModel,
  fields: EditTransferFields,
): Promise<void> {
  const paired = await getPairedTransaction(transaction)
  if (!paired) throw new Error("Paired transfer row not found.")

  const debitRow = transaction.amount < 0 ? transaction : paired
  const creditRow = transaction.amount > 0 ? transaction : paired

  const newFromAccountId = fields.fromAccountId ?? debitRow.accountId
  const newToAccountId = fields.toAccountId ?? creditRow.accountId
  const newDateMs = toDateMs(
    fields.transactionDate as number | Date | undefined,
    debitRow.transactionDate.getTime(),
  )

  const oldDebitAmount = Math.abs(debitRow.amount)
  const oldCreditAmount = creditRow.amount
  const newDebitAmount = fields.amount ?? oldDebitAmount

  // Fallback: derive existing rate from transaction amounts rather than defaulting to 1:1
  const oldImpliedRate =
    oldDebitAmount > 0 ? oldCreditAmount / oldDebitAmount : 1
  const newConversionRate = fields.conversionRate ?? oldImpliedRate
  const newCreditAmount =
    newConversionRate > 0 ? newDebitAmount * newConversionRate : newDebitAmount
  const newDate = new Date(newDateMs)

  const accounts = accountsCollection()
  const oldFromAccount = await accounts.find(debitRow.accountId)
  const oldToAccount = await accounts.find(creditRow.accountId)
  const fromAccountChanged = newFromAccountId !== debitRow.accountId
  const toAccountChanged = newToAccountId !== creditRow.accountId
  const newFromAccount = fromAccountChanged
    ? await accounts.find(newFromAccountId)
    : oldFromAccount
  const newToAccount = toAccountChanged
    ? await accounts.find(newToAccountId)
    : oldToAccount

  // Compute accountBalanceBefore for the updated transaction rows.
  // "Before" = the account balance just before this transfer's effect, relative to current state.
  const fromBalanceBefore = fromAccountChanged
    ? newFromAccount.balance
    : newFromAccount.balance + oldDebitAmount
  const toBalanceBefore = toAccountChanged
    ? newToAccount.balance
    : newToAccount.balance - oldCreditAmount

  const batchOps: Parameters<typeof database.batch>[0] = [
    debitRow.prepareUpdate((r) => {
      r.amount = -newDebitAmount
      r.transactionDate = newDate
      r.accountId = newFromAccountId
      r.relatedAccountId = newToAccountId
      r.accountBalanceBefore = fromBalanceBefore
      if (fields.title !== undefined) r.title = fields.title ?? null
      if (fields.notes !== undefined) r.description = fields.notes ?? null
      r.extra = null
    }),
    creditRow.prepareUpdate((r) => {
      r.amount = newCreditAmount
      r.transactionDate = newDate
      r.accountId = newToAccountId
      r.relatedAccountId = newFromAccountId
      r.accountBalanceBefore = toBalanceBefore
      if (fields.title !== undefined) r.title = fields.title ?? null
      if (fields.notes !== undefined) r.description = fields.notes ?? null
      r.extra = null
    }),
  ]

  const transfers = transfersCollection()
  const transferRows = await transfers
    .query(Q.where("from_transaction_id", debitRow.id))
    .fetch()
  const transferRow = transferRows[0]
  if (transferRow) {
    batchOps.push(
      transferRow.prepareUpdate((t) => {
        t.conversionRate = newConversionRate > 0 ? newConversionRate : 1
        t.fromAccountId = newFromAccountId
        t.toAccountId = newToAccountId
      }),
    )
  }

  if (!debitRow.isPending) {
    if (fromAccountChanged) {
      batchOps.push(
        oldFromAccount.prepareUpdate((a) => {
          a.balance = a.balance + oldDebitAmount
        }),
        newFromAccount.prepareUpdate((a) => {
          a.balance = a.balance - newDebitAmount
        }),
      )
    } else {
      batchOps.push(
        newFromAccount.prepareUpdate((a) => {
          a.balance = a.balance + (oldDebitAmount - newDebitAmount)
        }),
      )
    }
  }

  if (!creditRow.isPending) {
    if (toAccountChanged) {
      batchOps.push(
        oldToAccount.prepareUpdate((a) => {
          a.balance = a.balance - oldCreditAmount
        }),
        newToAccount.prepareUpdate((a) => {
          a.balance = a.balance + newCreditAmount
        }),
      )
    } else {
      batchOps.push(
        newToAccount.prepareUpdate((a) => {
          a.balance = a.balance + (newCreditAmount - oldCreditAmount)
        }),
      )
    }
  }

  await database.batch(...batchOps)
}

/**
 * Public wrapper for {@link editTransferWriter}.
 * Updates both legs of a transfer inside a `database.write()` context.
 *
 * @param transaction - Either leg of the existing transfer.
 * @param fields - The fields to update on both legs.
 */
export async function editTransfer(
  transaction: TransactionModel,
  fields: EditTransferFields,
): Promise<void> {
  return database.write(() => editTransferWriter(transaction, fields))
}

/* ------------------------------------------------------------------ */
/* Delete */
/* ------------------------------------------------------------------ */

/**
 * Writer body — must be called within a `database.write()` context.
 * Soft-deletes both legs of a transfer atomically using a single `database.batch()` call.
 * Reverses each account's balance using the transaction's amount (delta-based), not the
 * stored `accountBalanceBefore` snapshot, so that deleting the transfer never overwrites
 * the effect of other transactions on the same accounts.
 * Safe to call with either the debit or credit row.
 *
 * @param transaction - Either leg of the transfer to soft-delete.
 */
export async function deleteTransferWriter(
  transaction: TransactionModel,
): Promise<void> {
  const paired = await getPairedTransaction(transaction)
  const toDelete = paired ? [transaction, paired] : [transaction]

  const accounts = accountsCollection()
  const accountIds = [...new Set(toDelete.map((t) => t.accountId))]
  const accountMap = new Map<string, AccountModel>()
  for (const id of accountIds) {
    accountMap.set(id, await accounts.find(id))
  }

  const now = new Date()
  const batchOps: Parameters<typeof database.batch>[0] = []

  for (const t of toDelete) {
    if (!t.isDeleted && !t.isPending) {
      const account = accountMap.get(t.accountId)
      if (account) {
        // Undo this transaction's effect: reverse its amount from the current balance.
        // Debit rows have negative amounts (money left account) → add back to restore.
        // Credit rows have positive amounts (money entered account) → subtract to restore.
        batchOps.push(
          account.prepareUpdate((a) => {
            a.balance = a.balance - t.amount
          }),
        )
      }
    }
    batchOps.push(
      t.prepareUpdate((r) => {
        r.isDeleted = true
        r.deletedAt = now
      }),
    )
  }

  await database.batch(...batchOps)
}

/**
 * Public wrapper for {@link deleteTransferWriter}.
 * Soft-deletes both legs of a transfer inside a `database.write()` context.
 *
 * @param transaction - Either leg of the transfer to soft-delete.
 */
export async function deleteTransfer(
  transaction: TransactionModel,
): Promise<void> {
  return database.write(() => deleteTransferWriter(transaction))
}
