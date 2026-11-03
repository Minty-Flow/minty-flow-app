import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import type { Budget } from "~/types/budgets"
import type { Goal } from "~/types/goals"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"

/** Signed effect of one row on a budget: refunds subtract, everything else adds. */
function budgetDelta(
  budget: Budget,
  transaction: TransactionWithRelations,
): number {
  if (
    transaction.isPending ||
    transaction.type !== TransactionTypeEnum.EXPENSE ||
    transaction.isTransfer ||
    transaction.loanId ||
    transaction.account?.currencyCode !== budget.currencyCode
  ) {
    return 0
  }
  // A budget with no categories counts nothing, it is not "all categories".
  if (
    !transaction.categoryId ||
    !budget.categoryIds.includes(transaction.categoryId)
  ) {
    return 0
  }
  return transaction.subtype === TransactionSubTypeEnum.REFUND
    ? -transaction.amount
    : transaction.amount
}

/** True when the row moves the budget's spent figure (zero-amount rows excepted). */
export function isBudgetTransaction(
  budget: Budget,
  transaction: TransactionWithRelations,
): boolean {
  return budgetDelta(budget, transaction) !== 0
}

export function getLiveBudgetSpent(
  budget: Budget,
  transactions: TransactionWithRelations[],
): number {
  return Math.max(
    transactions.reduce(
      (sum, transaction) => sum + budgetDelta(budget, transaction),
      0,
    ),
    0,
  )
}

export function getLiveBudgetSpentByCategory(
  budget: Budget,
  transactions: TransactionWithRelations[],
): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const transaction of transactions) {
    if (!transaction.categoryId) continue
    const delta = budgetDelta(budget, transaction)
    if (delta === 0) continue
    totals[transaction.categoryId] =
      (totals[transaction.categoryId] ?? 0) + delta
  }
  // A category refunded past its spend stays at zero, so the breakdown never
  // reads as negative or cancels another category.
  for (const id of Object.keys(totals)) totals[id] = Math.max(totals[id], 0)
  return totals
}

export function getLiveGoalProgress(
  goal: Goal,
  transactions: TransactionWithRelations[],
): number {
  const type =
    goal.goalType === "expense"
      ? TransactionTypeEnum.EXPENSE
      : TransactionTypeEnum.INCOME
  return transactions.reduce((sum, transaction) => {
    if (
      transaction.isPending ||
      transaction.type !== type ||
      transaction.account?.currencyCode !== goal.currencyCode
    ) {
      return sum
    }
    return (
      sum +
      (transaction.subtype === TransactionSubTypeEnum.REFUND
        ? -transaction.amount
        : transaction.amount)
    )
  }, 0)
}
