import { and, eq, isNotNull, sql } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getRepaymentTypeForLoan } from "~/domain/transaction-kind"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Loan, LoanTerm, LoanType } from "~/types/loans"

import { drizzleDb } from "../db"
import { loans, transactions } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

/** Repaid total per loan: Σ amount of non-deleted, non-pending, loan-linked rows, keyed by (loanId, type). */
function useRepaidByLoan() {
  const result = useLiveQuery(
    drizzleDb
      .select({
        loanId: transactions.loanId,
        type: transactions.type,
        total: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .where(
        and(
          isNotNull(transactions.loanId),
          eq(transactions.isDeleted, 0),
          eq(transactions.isPending, 0),
        ),
      )
      .groupBy(transactions.loanId, transactions.type),
  )

  const sums = new Map<string, { income: number; expense: number }>()
  for (const row of result.data) {
    if (!row.loanId) continue
    const entry = sums.get(row.loanId) ?? { income: 0, expense: 0 }
    if (row.type === "income") entry.income += Number(row.total ?? 0)
    else if (row.type === "expense") entry.expense += Number(row.total ?? 0)
    sums.set(row.loanId, entry)
  }
  return { result, sums }
}

export function useLoansQuery(): LiveReadModelResult<Loan[]> {
  const result = useLiveQuery(
    drizzleDb.select().from(loans).orderBy(loans.name),
  )
  const { result: repaidResult, sums } = useRepaidByLoan()

  const data = result.data
    .map((row) => {
      const loanType = row.loanType as LoanType
      const principal = row.principalAmount
      const byType = sums.get(row.id)
      const repaidAmount =
        (getRepaymentTypeForLoan(loanType) === "income"
          ? byType?.income
          : byType?.expense) ?? 0
      const remainingAmount = Math.max(0, principal - repaidAmount)
      const progress =
        principal > 0 ? Math.min(Math.max(repaidAmount / principal, 0), 1) : 1

      return {
        id: row.id,
        name: row.name,
        description: row.description,
        principalAmount: principal,
        loanType,
        term: (row.term as LoanTerm) ?? "one_time",
        dueDate: row.dueDate != null ? new Date(row.dueDate) : null,
        accountId: row.accountId,
        categoryId: row.categoryId,
        icon: row.icon,
        colorSchemeName: row.colorSchemeName,
        colorScheme: getThemeStrict(row.colorSchemeName),
        isOverdue: row.dueDate != null && new Date() > new Date(row.dueDate),
        repaidAmount,
        remainingAmount,
        progress,
        isClosed: progress >= 1,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }
    })
    .sort((a, b) => {
      if (a.dueDate == null && b.dueDate == null) {
        return a.name.localeCompare(b.name)
      }
      if (a.dueDate == null) return 1
      if (b.dueDate == null) return -1
      const diff = a.dueDate.getTime() - b.dueDate.getTime()
      if (diff !== 0) return diff
      return a.name.localeCompare(b.name)
    })

  return createLiveReadModelResult(data, [result, repaidResult])
}

export function useAllLoans(): Loan[] {
  return useLoansQuery().data
}
