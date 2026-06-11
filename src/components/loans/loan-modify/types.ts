import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Loan, LoanType } from "~/types/loans"

export interface LoanPrefill {
  name?: string
  description?: string
  accountId?: string
  principalAmount?: number
  loanType?: LoanType
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

export interface LoanFormModalsProps {
  deleteModalVisible: boolean
  unsavedModalVisible: boolean
  isAddMode: boolean
  loan?: Loan
  onCloseDeleteModal: () => void
  onCloseUnsavedModal: () => void
  onConfirmDelete: () => void
  onDiscardAndNavigate: () => void
}
