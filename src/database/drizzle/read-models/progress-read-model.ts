import { and, eq, gte, inArray, isNull, lte, sql } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { useMemo } from "react"

import type { Budget } from "~/types/budgets"
import type { Goal } from "~/types/goals"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"

import { drizzleDb } from "../db"
import { accounts, transactions } from "../schema"

// Live queries only re-run when the FROM table changes, so these join
// `accounts` but are driven by `transactions` writes (what moves progress).

const notTransferLeg = sql`NOT EXISTS (
  SELECT 1 FROM transfers tr
  WHERE tr.from_transaction_id = ${transactions.id}
     OR tr.to_transaction_id = ${transactions.id}
)`

/**
 * Amount spent against a budget in `[from, to]`, computed in SQL so the card
 * never hydrates transaction rows. Mirrors `getLiveBudgetSpent`: confirmed,
 * non-deleted expenses outside transfers, in the budget currency, refunds
 * subtracting, floored at zero.
 */
export function useBudgetSpent(budget: Budget, from: Date, to: Date): number {
  const accountIds =
    budget.accountIds.length > 0 ? budget.accountIds : ["__none__"]
  const categoryIds =
    budget.categoryIds.length > 0 ? budget.categoryIds : ["__none__"]
  const fromIso = from.toISOString()
  const toIso = to.toISOString()
  const key = JSON.stringify([
    budget.id,
    budget.currencyCode,
    accountIds,
    categoryIds,
    fromIso,
    toIso,
  ])
  const { data } = useLiveQuery(
    drizzleDb
      .select({
        total: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.subtype} = ${TransactionSubTypeEnum.REFUND} THEN -${transactions.amount} ELSE ${transactions.amount} END), 0)`,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.isDeleted, 0),
          eq(transactions.isPending, 0),
          eq(transactions.type, TransactionTypeEnum.EXPENSE),
          eq(accounts.currencyCode, budget.currencyCode),
          inArray(transactions.accountId, accountIds),
          gte(transactions.transactionDate, fromIso),
          lte(transactions.transactionDate, toIso),
          inArray(transactions.categoryId, categoryIds),
          notTransferLeg,
        ),
      ),
    [key],
  )
  return Math.max(0, data[0]?.total ?? 0)
}

/** Progress of a goal: sum of its confirmed, non-deleted matching entries. */
export function useGoalProgress(goal: Goal): number {
  const type =
    goal.goalType === "expense"
      ? TransactionTypeEnum.EXPENSE
      : TransactionTypeEnum.INCOME
  const { data } = useLiveQuery(
    drizzleDb
      .select({ total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.goalId, goal.id),
          eq(transactions.isDeleted, 0),
          eq(transactions.isPending, 0),
          eq(transactions.type, type),
          eq(accounts.currencyCode, goal.currencyCode),
        ),
      ),
    [goal.id, goal.currencyCode, type],
  )
  return data[0]?.total ?? 0
}

export interface AccountPeriodTotals {
  in: number
  out: number
  net: number
}

/**
 * Per-account money in/out for `[from, to]` in one grouped query, instead of
 * hydrating every transaction of the period. Loan cash flows are excluded;
 * refunds reduce `out`; transfer legs count by sign unless `excludeTransfers`.
 */
export function useAccountPeriodTotals(
  from: Date,
  to: Date,
  excludeTransfers: boolean,
): { totals: Map<string, AccountPeriodTotals>; isReady: boolean } {
  const fromIso = from.toISOString()
  const toIso = to.toISOString()
  const transferIn = excludeTransfers
    ? sql`0`
    : sql`CASE WHEN ${transactions.type} = ${TransactionTypeEnum.TRANSFER} AND ${transactions.amount} > 0 THEN ${transactions.amount} ELSE 0 END`
  const transferOut = excludeTransfers
    ? sql`0`
    : sql`CASE WHEN ${transactions.type} = ${TransactionTypeEnum.TRANSFER} AND ${transactions.amount} <= 0 THEN -${transactions.amount} ELSE 0 END`
  const { data, updatedAt } = useLiveQuery(
    drizzleDb
      .select({
        accountId: transactions.accountId,
        in: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = ${TransactionTypeEnum.INCOME} THEN ${transactions.amount} ELSE 0 END + ${transferIn}), 0)`,
        out: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = ${TransactionTypeEnum.EXPENSE} THEN (CASE WHEN ${transactions.subtype} = ${TransactionSubTypeEnum.REFUND} THEN -${transactions.amount} ELSE ${transactions.amount} END) ELSE 0 END + ${transferOut}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.isDeleted, 0),
          eq(transactions.isPending, 0),
          isNull(transactions.loanId),
          gte(transactions.transactionDate, fromIso),
          lte(transactions.transactionDate, toIso),
        ),
      )
      .groupBy(transactions.accountId),
    [fromIso, toIso, excludeTransfers],
  )
  const totals = useMemo(
    () =>
      new Map(
        data.map((row) => [
          row.accountId,
          { in: row.in, out: row.out, net: row.in - row.out },
        ]),
      ),
    [data],
  )
  return { totals, isReady: updatedAt !== undefined }
}
