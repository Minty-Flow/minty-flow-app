import { withObservables } from "@nozbe/watermelondb/react"
import { useLocalSearchParams } from "expo-router"

import { LoanModifyContent } from "~/components/loans/loan-modify/loan-modify-content"
import type LoanModel from "~/database/models/loan"
import { observeAccounts } from "~/database/services/account-service"
import { observeAllCategories } from "~/database/services/category-service"
import { observeLoanById } from "~/database/services/loan-service"
import { modelToLoan } from "~/database/utils/model-to-loan"
import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Loan } from "~/types/loans"
import { NewEnum } from "~/types/new"

// --- Edit mode: observes the loan model, accounts, and categories ---
// All data is fully resolved before the component mounts, so useForm receives
// correct defaultValues on the very first render.

interface EnhancedEditProps {
  loanId: string
  loanModel: LoanModel
  accounts: Account[]
  categories: Category[]
}

function EditLoanScreen({
  loanId,
  loanModel,
  accounts,
  categories,
}: EnhancedEditProps) {
  const loan: Loan = modelToLoan(loanModel)

  return (
    <LoanModifyContent
      key={loan.id}
      loanModifyId={loanId}
      loan={loan}
      loanModel={loanModel}
      accounts={accounts}
      categories={categories}
    />
  )
}

const EnhancedEditScreen = withObservables(
  ["loanId"],
  ({ loanId }: { loanId: string }) => ({
    loanModel: observeLoanById(loanId),
    accounts: observeAccounts(),
    categories: observeAllCategories(),
  }),
)(EditLoanScreen)

// --- Add mode: only observes accounts and categories (no loan model yet) ---

interface EnhancedAddProps {
  loanId: string
  accounts: Account[]
  categories: Category[]
}

function AddLoanScreen({ loanId, accounts, categories }: EnhancedAddProps) {
  return (
    <LoanModifyContent
      loanModifyId={loanId}
      accounts={accounts}
      categories={categories}
    />
  )
}

const EnhancedAddScreen = withObservables([], () => ({
  accounts: observeAccounts(),
  categories: observeAllCategories(),
}))(AddLoanScreen)

// --- Route entry point ---

export default function LoanModifyScreen() {
  const params = useLocalSearchParams<{ loanId: string }>()
  const loanId = params.loanId ?? NewEnum.NEW
  const isAddMode = loanId === NewEnum.NEW || !loanId

  if (isAddMode) {
    return <EnhancedAddScreen loanId={NewEnum.NEW} />
  }

  return <EnhancedEditScreen loanId={loanId} />
}
