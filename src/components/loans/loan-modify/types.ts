import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Loan, LoanTerm, LoanType } from "~/types/loans"

export interface LoanPrefill {
  name?: string
  description?: string
  accountId?: string
  principalAmount?: number
  loanType?: LoanType
  term?: LoanTerm
}

export interface LoanModifyContentProps {
  loanModifyId: string
  loan?: Loan
  accounts: Account[]
  categories: Category[]
  prefill?: LoanPrefill
}

export interface LoanFormFooterProps {
  formName: string
  isAddMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  onCancel: () => void
  onSave: () => void
}

export interface LoanFormSheetsProps {
  deleteSheetVisible: boolean
  unsavedSheetVisible: boolean
  isAddMode: boolean
  loan?: Loan
  onCloseDeleteSheet: () => void
  onCloseUnsavedSheet: () => void
  onConfirmDelete: () => void
  onDiscardAndNavigate: () => void
}
