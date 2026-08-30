import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import type { Account } from "~/types/accounts"
import {
  type TransactionKind,
  type TransactionType,
  TransactionTypeEnum,
} from "~/types/transactions"

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
      location: undefined,
      subtype: null,
      kind: initialKind ?? "default",
      conversionRate: null,
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
    amount: Math.abs(transaction.amount),
    type: transaction.type ?? transactionType,
    transactionDate: transaction.transactionDate,
    accountId: fromId,
    toAccountId: isTransfer ? toId : undefined,
    categoryId: transaction.categoryId,
    title: transaction.title ?? "",
    description: transaction.description ?? "",
    isPending: transaction.isPending,
    tags: initialTagIds,
    goalId: transaction.goalId ?? null,
    budgetId: transaction.budgetId ?? null,
    loanId: transaction.loanId ?? null,
    location: transaction.location,
    subtype: transaction.subtype ?? null,
    kind: initialKind ?? transaction.kind ?? "default",
    conversionRate: null,
  }
}

export function mergeReducer<S>(state: S, update: Partial<S>): S {
  return { ...state, ...update }
}
