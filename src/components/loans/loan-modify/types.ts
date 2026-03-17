import type LoanModel from "~/database/models/loan"
import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Loan } from "~/types/loans"

export interface LoanModifyContentProps {
  loanModifyId: string
  loan?: Loan
  loanModel?: LoanModel
  accounts: Account[]
  categories: Category[]
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
