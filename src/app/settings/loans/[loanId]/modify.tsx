import { useLocalSearchParams } from "expo-router"
import { useTranslation } from "react-i18next"

import { LoanModifyContent } from "~/components/loans/loan-modify/loan-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useCategories } from "~/database/drizzle/read-models/category-read-model"
import { useLoansQuery } from "~/database/drizzle/read-models/loan-read-model"
import { useModifyRouteLoader } from "~/hooks/use-modify-route-loader"
import { type LoanTerm, type LoanType, LoanTypeEnum } from "~/types/loans"
import { NewEnum } from "~/types/new"
export default function LoanModifyScreen() {
  const { t } = useTranslation()
  const params = useLocalSearchParams<{
    loanId: string
    prefillName?: string
    prefillDescription?: string
    prefillAccountId?: string
    prefillAmount?: string
    prefillLoanType?: string
    prefillTerm?: string
  }>()
  const loanId = params.loanId ?? NewEnum.NEW
  const loansQuery = useLoansQuery()
  const loadState = useModifyRouteLoader({
    id: loanId,
    data: loansQuery.data,
    updatedAt: loansQuery.updatedAt,
    notFoundMessage: t("common.notFound.loan"),
  })
  const accounts = useActiveAccounts()
  const categories = useCategories()
  const prefill = (() => {
    const term =
      params.prefillTerm === "one_time" || params.prefillTerm === "long_term"
        ? (params.prefillTerm as LoanTerm)
        : undefined
    if (
      !params.prefillName &&
      !params.prefillAccountId &&
      !params.prefillAmount &&
      !term
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
      term,
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
