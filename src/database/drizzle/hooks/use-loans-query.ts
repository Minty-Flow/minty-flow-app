import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Loan, LoanType } from "~/types/loans"

import { drizzleDb } from "../db"
import { loans } from "../schema"

export function useLoansQuery(): {
  data: Loan[]
  error: Error | undefined
  updatedAt: Date | undefined
} {
  const result = useLiveQuery(
    drizzleDb.select().from(loans).orderBy(loans.name),
  )
  const data = result.data
    .map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      principalAmount: row.principalAmount,
      loanType: row.loanType as LoanType,
      dueDate: row.dueDate != null ? new Date(row.dueDate) : null,
      accountId: row.accountId,
      categoryId: row.categoryId,
      icon: row.icon,
      colorSchemeName: row.colorSchemeName,
      colorScheme: getThemeStrict(row.colorSchemeName),
      isOverdue: row.dueDate != null && new Date() > new Date(row.dueDate),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }))
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

  return {
    data,
    error: result.error,
    updatedAt: result.updatedAt,
  }
}
