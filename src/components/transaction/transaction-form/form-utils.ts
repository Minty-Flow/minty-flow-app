import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import type { Account } from "~/types/accounts"
import {
  type TransactionItem,
  type TransactionKind,
  type TransactionType,
  TransactionTypeEnum,
} from "~/types/transactions"

/**
 * Line items fit a one-off expense or income. Not transfers, recurring kinds
 * (their template has no items) or loan kinds.
 */
export function canHaveItems(
  type: TransactionType,
  kind: TransactionKind | undefined,
): boolean {
  return (
    type !== TransactionTypeEnum.TRANSFER &&
    (kind === undefined || kind === "default" || kind === "upcoming")
  )
}

/** Sum of every line (unit price × quantity), in minor units. */
export function itemsTotal(items: TransactionItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

export function getDefaultValues(
  transaction: TransactionWithRelations | null,
  accounts: Account[],
  transactionType: TransactionType,
  initialTagIds: string[] = [],
  prefill?: Partial<TransactionFormValues>,
  initialKind?: TransactionKind,
): TransactionFormValues {
  const defaultAccountId = accounts.find((a) => a.isPrimary)?.id ?? ""

  if (!transaction) {
    // prefill values win over computed defaults (e.g. pre-selected account/category/loan)
    return {
      amount: 0,
      type: transactionType,
      transactionDate: new Date(),
      accountId: defaultAccountId,
      toAccountId:
        transactionType === TransactionTypeEnum.TRANSFER ? "" : undefined,
      categoryId: null,
      title: "",
      description: "",
      isPending: false,
      tags: [],
      items: [],
      location: undefined,
      subtype: null,
      kind: initialKind ?? "default",
      conversionRate: null,
      attachments: null,
      ...prefill,
    }
  }
  const isTransfer =
    transaction.type === TransactionTypeEnum.TRANSFER &&
    transaction.isTransfer &&
    transaction.transferId
  const fromId =
    isTransfer && transaction.amount < 0
      ? transaction.accountId
      : isTransfer && transaction.relatedAccountId
        ? transaction.relatedAccountId
        : transaction.accountId
  const toId =
    isTransfer && transaction.amount > 0
      ? transaction.accountId
      : isTransfer && transaction.relatedAccountId
        ? transaction.relatedAccountId
        : ""
  return {
    // The form edits a transfer through its debit leg, in the source account's
    // currency. Opening the credit leg must not put its own amount (in the
    // destination currency) in that field.
    amount: isTransfer
      ? (transaction.transferSourceAmount ?? Math.abs(transaction.amount))
      : Math.abs(transaction.amount),
    type: transaction.type ?? transactionType,
    transactionDate: transaction.transactionDate,
    accountId: fromId,
    toAccountId: isTransfer ? toId : undefined,
    categoryId: transaction.categoryId,
    title: transaction.title ?? "",
    description: transaction.description ?? "",
    isPending: transaction.isPending,
    tags: initialTagIds,
    items: transaction.items,
    goalId: transaction.goalId ?? null,
    budgetId: transaction.budgetId ?? null,
    loanId: transaction.loanId ?? null,
    location: transaction.location,
    // Drop retired legacy subtype values (recurring / one-time / loan_*) so the
    // form's zod resolver doesn't reject an edit of an old row.
    subtype: transaction.subtype === "refund" ? "refund" : null,
    kind: initialKind ?? transaction.kind ?? "default",
    conversionRate: null,
    attachments: transaction?.extra?.attachments ?? null,
  }
}

export function mergeReducer<S>(state: S, update: Partial<S>): S {
  return { ...state, ...update }
}

/**
 * A trashed transaction can only be restored or deleted for good. Editing or
 * confirming it would move a balance for a row that is not part of any balance.
 */
export function isFormReadOnly(
  transaction: { isDeleted: boolean } | null,
): boolean {
  return transaction?.isDeleted === true
}
