import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"

import { LoanModifyContent } from "~/components/loans/loan-modify/loan-modify-content"
import type { LoanPrefill } from "~/components/loans/loan-modify/types"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useCategories } from "~/stores/db/category.store"
import { useLoan } from "~/stores/db/loan.store"
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

  const loan = useLoan(loanId)
  const accounts = useActiveAccounts()
  const categories = useCategories()

  const prefill = useMemo<LoanPrefill | undefined>(() => {
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
      principalAmount: params.prefillAmount
        ? Number.parseFloat(params.prefillAmount)
        : undefined,
      loanType: (Object.values(LoanTypeEnum) as string[]).includes(
        params.prefillLoanType ?? "",
      )
        ? (params.prefillLoanType as LoanType)
        : undefined,
    }
  }, [
    params.prefillName,
    params.prefillDescription,
    params.prefillAccountId,
    params.prefillAmount,
    params.prefillLoanType,
  ])

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
