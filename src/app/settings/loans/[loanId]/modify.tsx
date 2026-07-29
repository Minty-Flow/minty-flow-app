import { useLocalSearchParams } from "expo-router"

import { LoanModifyContent } from "~/components/loans/loan-modify/loan-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useLoansQuery } from "~/database/drizzle/hooks/use-loans-query"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useCategories } from "~/stores/db/category.store"
import { type LoanType, LoanTypeEnum } from "~/types/loans"
import { NewEnum } from "~/types/new"
export default function LoanModifyScreen() {
  const params = useLocalSearchParams<{
    loanId: string
    prefillName?: string
    prefillDescription?: string
    prefillAccountId?: string
    prefillAmount?: string
    prefillLoanType?: string
  }>()
  const loanId = params.loanId ?? NewEnum.NEW
  const isAddMode = loanId === NewEnum.NEW || !loanId
  const loansQuery = useLoansQuery()
  const loan = loansQuery.data.find((item) => item.id === loanId)
  const accounts = useActiveAccounts()
  const categories = useCategories()
  const prefill = (() => {
    if (
      !params.prefillName &&
      !params.prefillAccountId &&
      !params.prefillAmount
    )
      return undefined
    return {
      name: params.prefillName,
      description: params.prefillDescription,
      accountId: params.prefillAccountId,
      principalAmount:
        params.prefillAmount &&
        Number.isSafeInteger(Number(params.prefillAmount))
          ? Number(params.prefillAmount)
          : undefined,
      loanType: (Object.values(LoanTypeEnum) as string[]).includes(
        params.prefillLoanType ?? "",
      )
        ? (params.prefillLoanType as LoanType)
        : undefined,
    }
  })()
  if (isAddMode) {
    return (
      <LoanModifyContent
        loanModifyId={NewEnum.NEW}
        accounts={accounts}
        categories={categories}
        prefill={prefill}
      />
    )
  }
  if (loansQuery.updatedAt === undefined) return <RouteLoadingState />
  if (!loan) return <RouteNotFoundState message="Loan not found." />

  return (
    <LoanModifyContent
      key={loanId}
      loanModifyId={loanId}
      loan={loan}
      accounts={accounts}
      categories={categories}
    />
  )
}
