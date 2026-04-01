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
  const now = new Date()
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
    r.createdAt = now
    r.updatedAt = now
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
    r.createdAt = now
    r.updatedAt = now
    r.extra = recurringOptions?.extra ?? null
    r.recurringId = recurringOptions?.recurringId ?? null
    r.hasAttachments = false
    r.subtype = recurringOptions?.subtype ?? null
    r.location = null
  })

  const updateFrom = fromAccount.prepareUpdate((a) => {
    a.balance = a.balance - amount
    a.updatedAt = now
  })
  const updateTo = toAccount.prepareUpdate((a) => {
    a.balance = a.balance + creditAmount
    a.updatedAt = now
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
      t.createdAt = now
      t.updatedAt = now
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
 * Updates both legs of a transfer atomically. Accepts either the debit or credit row;
 * the paired row is resolved internally. Reverses the old account balances using the
 * stored `accountBalanceBefore` values before applying the new amounts, and updates
 * the `transfers` record if one exists (cross-currency).
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
  const newDebitAmount = fields.amount ?? Math.abs(debitRow.amount)
  const newConversionRate = fields.conversionRate
  const newCreditAmount =
    newConversionRate != null && newConversionRate > 0
      ? newDebitAmount * newConversionRate
      : newDebitAmount
  const newDate = new Date(newDateMs)
  const now = new Date()

  const accounts = accountsCollection()
  const oldFromAccount = await accounts.find(debitRow.accountId)
  const oldToAccount = await accounts.find(creditRow.accountId)
  const newFromAccount =
    newFromAccountId === debitRow.accountId
      ? oldFromAccount
      : await accounts.find(newFromAccountId)
  const newToAccount =
    newToAccountId === creditRow.accountId
      ? oldToAccount
      : await accounts.find(newToAccountId)

  const transfers = transfersCollection()

  if (!debitRow.isPending) {
    await oldFromAccount.update((a) => {
      a.balance = debitRow.accountBalanceBefore
      a.updatedAt = now
    })
  }
  if (!creditRow.isPending) {
    await oldToAccount.update((a) => {
      a.balance = creditRow.accountBalanceBefore
      a.updatedAt = now
    })
  }

  const fromBalanceBeforeApply = newFromAccount.balance
  const toBalanceBeforeApply = newToAccount.balance

  await debitRow.update((r) => {
    r.amount = -newDebitAmount
    r.transactionDate = newDate
    r.accountId = newFromAccountId
    r.relatedAccountId = newToAccountId
    r.accountBalanceBefore = fromBalanceBeforeApply
    if (fields.title !== undefined) r.title = fields.title ?? null
    if (fields.notes !== undefined) r.description = fields.notes ?? null
    r.extra = null
    r.updatedAt = now
  })

  await creditRow.update((r) => {
    r.amount = newCreditAmount
    r.transactionDate = newDate
    r.accountId = newToAccountId
    r.relatedAccountId = newFromAccountId
    r.accountBalanceBefore = toBalanceBeforeApply
    if (fields.title !== undefined) r.title = fields.title ?? null
    if (fields.notes !== undefined) r.description = fields.notes ?? null
    r.extra = null
    r.updatedAt = now
  })

  const transferRows = await transfers
    .query(Q.where("from_transaction_id", debitRow.id))
    .fetch()
  const transferRow = transferRows[0]
  if (transferRow) {
    await transferRow.update((t) => {
      t.conversionRate =
        newConversionRate != null && newConversionRate > 0
          ? newConversionRate
          : 1
      t.fromAccountId = newFromAccountId
      t.toAccountId = newToAccountId
      t.updatedAt = now
    })
  }

  if (!debitRow.isPending) {
    await newFromAccount.update((a) => {
      a.balance = a.balance - newDebitAmount
      a.updatedAt = now
    })
  }
  if (!creditRow.isPending) {
    await newToAccount.update((a) => {
      a.balance = a.balance + newCreditAmount
      a.updatedAt = now
    })
  }
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
 * Soft-deletes both legs of a transfer atomically by setting `is_deleted = true`.
 * Restores each account's balance to `accountBalanceBefore` so that deleting a stale
 * transaction never corrupts the running balance. Safe to call with either the debit or credit row.
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

  for (const t of toDelete) {
    if (!t.isDeleted && !t.isPending) {
      const account = accountMap.get(t.accountId)
      if (account) {
        await account.update((a) => {
          a.balance = t.accountBalanceBefore
          a.updatedAt = now
        })
      }
    }
    await t.update((r) => {
      r.isDeleted = true
      r.deletedAt = now
      r.updatedAt = now
    })
  }
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
