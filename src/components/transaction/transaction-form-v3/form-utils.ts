import type TransactionModel from "~/database/models/transaction"
import i18n from "~/i18n/config"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import type { Account } from "~/types/accounts"
import type { RecurringFrequency, TransactionType } from "~/types/transactions"
import {
  formatDayName,
  formatMonthDay,
  formatOrdinalDay,
} from "~/utils/time-utils"

export function getRecurrenceDisplayLabel(
  frequency: RecurringFrequency,
  startDate: Date,
) {
  const { t } = i18n

  if (frequency === null) return t("components.recurring.frequency.none")
  switch (frequency) {
    case "daily":
      return t("components.recurring.frequency.daily")
    case "weekly":
      return t("components.recurring.frequency.weekly", {
        day: formatDayName(startDate),
      })
    case "biweekly":
      return t("components.recurring.frequency.biweekly", {
        day: formatDayName(startDate),
      })
    case "monthly":
      return t("components.recurring.frequency.monthly", {
        date: formatOrdinalDay(startDate),
      })
    case "yearly":
      return t("components.recurring.frequency.yearly", {
        date: formatMonthDay(startDate),
      })
    default:
      return t("components.recurring.frequency.none")
  }
}

export function getDefaultValues(
  transaction: TransactionModel | null,
  accounts: Account[],
  transactionType: TransactionType,
  initialTagIds: string[] = [],
): TransactionFormValues {
  const defaultAccountId =
    accounts.find((a) => a.isPrimary && !a.isArchived)?.id ?? ""

  if (!transaction) {
    return {
      amount: 0,
      type: transactionType,
      transactionDate: new Date(),
      accountId: defaultAccountId,
      toAccountId: transactionType === "transfer" ? "" : undefined,
      categoryId: null,
      title: "",
      description: "",
      isPending: false,
      tags: [],
      location: undefined,
    }
  }
  const isTransfer =
    (transaction.type as TransactionType) === "transfer" &&
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
    type: (transaction.type as TransactionType) ?? transactionType,
    transactionDate: transaction.transactionDate,
    accountId: fromId,
    toAccountId: isTransfer ? toId : undefined,
    categoryId: transaction.categoryId,
    title: transaction.title ?? "",
    description: transaction.description ?? "",
    isPending: transaction.isPending,
    tags: initialTagIds,
    location: transaction.location,
  }
}

/** Returns the raw validation key from the schema (caller should pass to t() for display). */
export function getFieldError(
  _field: keyof TransactionFormValues,
  message: string | undefined,
): string | undefined {
  return message ?? undefined
}

export function mergeReducer<S>(state: S, update: Partial<S>): S {
  return { ...state, ...update }
}
