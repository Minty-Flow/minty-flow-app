import { useLoansQuery } from "~/database/drizzle/hooks/use-loans-query"
import type { Loan } from "~/types/loans"

export function useAllLoans(): Loan[] {
  return useLoansQuery().data
}

export function useLoan(id: string): Loan | undefined {
  return useAllLoans().find((loan) => loan.id === id)
}
