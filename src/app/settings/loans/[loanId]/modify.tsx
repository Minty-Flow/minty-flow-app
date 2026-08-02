import { useLocalSearchParams } from "expo-router"

import { LoanModifyContent } from "~/components/loans/loan-modify/loan-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useCategories } from "~/database/drizzle/read-models/category-read-model"
import { useLoansQuery } from "~/database/drizzle/read-models/loan-read-model"
import { useModifyRouteLoader } from "~/hooks/use-modify-route-loader"
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
  const loansQuery = useLoansQuery()
  const loadState = useModifyRouteLoader({
    id: loanId,
    data: loansQuery.data,
    updatedAt: loansQuery.updatedAt,
    find: (item, id) => item.id === id,
    notFoundMessage: "Loan not found.",
  })
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
  if (loadState.mode === "new") {
    return (
      <LoanModifyContent
        loanModifyId={NewEnum.NEW}
        accounts={accounts}
        categories={categories}
        prefill={prefill}
      />
    )
  }
  if (loadState.mode === "loading") return <RouteLoadingState />
  if (loadState.mode === "not-found") {
    return <RouteNotFoundState message={loadState.message} />
  }

  return (
    <LoanModifyContent
      key={loanId}
      loanModifyId={loanId}
      loan={loadState.entity}
      accounts={accounts}
      categories={categories}
    />
  )
}
