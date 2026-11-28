import { and, eq, gte, inArray, isNull, lte, ne, sql } from "drizzle-orm"

import type { Budget } from "~/types/budgets"
import {
  TransactionKindEnum,
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"

import { drizzleDb } from "../db"
import { accounts, transactions } from "../schema"

const notTransferLeg = sql`NOT EXISTS (
  SELECT 1 FROM transfers tr
  WHERE tr.from_transaction_id = ${transactions.id}
     OR tr.to_transaction_id = ${transactions.id}
)`

const spentSign = sql`CASE WHEN ${transactions.subtype} = ${TransactionSubTypeEnum.REFUND} THEN -${transactions.amount} ELSE ${transactions.amount} END`

/**
 * The rows a budget counts in `[from, to]`: confirmed, non-deleted expenses
 * outside transfers and loans, in the budget currency, on its accounts and
 * categories. Same rules as `getLiveBudgetSpent`; change both together.
 */
function countsTowards(budget: Budget, from: Date, to: Date) {
  const accountIds =
    budget.accountIds.length > 0 ? budget.accountIds : ["__none__"]
  const categoryIds =
    budget.categoryIds.length > 0 ? budget.categoryIds : ["__none__"]
  return and(
    eq(transactions.isDeleted, 0),
    eq(transactions.isPending, 0),
    eq(transactions.type, TransactionTypeEnum.EXPENSE),
    eq(accounts.currencyCode, budget.currencyCode),
    inArray(transactions.accountId, accountIds),
    gte(transactions.transactionDate, from.toISOString()),
    lte(transactions.transactionDate, to.toISOString()),
    inArray(transactions.categoryId, categoryIds),
    // Lending and repaying move money; they are not spending.
    isNull(transactions.loanId),
    // Deleting a loan nulls loanId but keeps the kind; exclude those too.
    ne(transactions.kind, TransactionKindEnum.LENT),
    ne(transactions.kind, TransactionKindEnum.BORROWED),
    notTransferLeg,
  )
}

/** One row, `total`: the amount spent against a budget, refunds subtracting. */
export function budgetSpentQuery(budget: Budget, from: Date, to: Date) {
  return drizzleDb
    .select({
      total: sql<number>`COALESCE(SUM(${spentSign}), 0)`,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(countsTowards(budget, from, to))
}

export interface BudgetWindow {
  /** Names this budget's column in the result row. */
  key: string
  budget: Budget
  from: Date
  to: Date
}

/**
 * One row with the amount spent for each window, in a single pass over the
 * transactions since the earliest one starts. `windows` must not be empty.
 */
export function budgetsSpentQuery(windows: BudgetWindow[]) {
  const earliest = new Date(
    Math.min(...windows.map((window) => window.from.getTime())),
  )
  return drizzleDb
    .select(
      Object.fromEntries(
        windows.map(({ key, budget, from, to }) => [
          key,
          sql<number>`COALESCE(SUM(CASE WHEN ${countsTowards(budget, from, to)} THEN ${spentSign} ELSE 0 END), 0)`,
        ]),
      ),
    )
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(gte(transactions.transactionDate, earliest.toISOString()))
}
