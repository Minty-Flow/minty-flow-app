import type { TransactionWithRelations } from "~/stores/db/transaction.store"
import type { Budget } from "~/types/budgets"
import type { Goal } from "~/types/goals"
import type { Loan } from "~/types/loans"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"

export function getLiveBudgetSpent(
  budget: Budget,
  transactions: TransactionWithRelations[],
): number {
  return Math.max(
    transactions.reduce((sum, transaction) => {
      if (
        transaction.isPending ||
        transaction.type !== TransactionTypeEnum.EXPENSE ||
        transaction.isTransfer ||
        transaction.account?.currencyCode !== budget.currencyCode
      ) {
        return sum
      }
      if (
        budget.categoryIds.length > 0 &&
        (!transaction.categoryId ||
          !budget.categoryIds.includes(transaction.categoryId))
      ) {
        return sum
      }
      return (
        sum +
        (transaction.subtype === TransactionSubTypeEnum.REFUND
          ? -transaction.amount
          : transaction.amount)
      )
    }, 0),
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
    const spent = getLiveBudgetSpent(budget, [transaction])
    if (spent <= 0) continue
    totals[transaction.categoryId] =
      (totals[transaction.categoryId] ?? 0) + spent
  }
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
    return sum + transaction.amount
  }, 0)
}

export function getLiveLoanProgress(
  loan: Loan,
  transactions: TransactionWithRelations[],
): number {
  const type =
    loan.loanType === "lent"
      ? TransactionTypeEnum.INCOME
      : TransactionTypeEnum.EXPENSE
  return transactions.reduce((sum, transaction) => {
    if (
      transaction.isPending ||
      transaction.type !== type ||
      transaction.accountId !== loan.accountId
    ) {
      return sum
    }
    return sum + Math.abs(transaction.amount)
  }, 0)
}
