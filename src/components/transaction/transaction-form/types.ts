import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import type {
  RecurringEditPayload,
  TransactionFormValues,
} from "~/schemas/transactions.schema"
import type { Account } from "~/types/accounts"
import type { Budget } from "~/types/budgets"
import type { Category } from "~/types/categories"
import type { Goal } from "~/types/goals"
import type { Loan } from "~/types/loans"
import type { Tag } from "~/types/tags"
import type {
  Recurrence,
  TransactionAttachment,
  TransactionKind,
  TransactionType,
} from "~/types/transactions"

export type DatePickerTarget = "transaction" | "recurringEnd"

export interface TransactionFormProps {
  transaction: TransactionWithRelations | null
  accounts: Account[]
  categories: Category[]
  tags: Tag[]
  goals: Goal[]
  budgets: Budget[]
  loans: Loan[]
  transactionType: TransactionType
  onTransactionTypeChange: (type: TransactionType) => void
  initialTagIds?: string[]
  initialKind?: TransactionKind
  prefill?: Partial<TransactionFormValues>
}

export type OverlayState = {
  unsavedSheetVisible: boolean
  editRecurringSheetVisible: boolean
  deleteRecurringSheetVisible: boolean
  deleteLoanSheetVisible: boolean
  destroySheetVisible: boolean
  notesModalVisible: boolean
  locationPickerVisible: boolean
  pendingEditPayload: RecurringEditPayload | null
}

export type DatePickerState = {
  visible: boolean
  mode: "date" | "time"
  tempDate: Date
  androidStage: "date" | "time" | null
}

export type RecurringState = {
  recurrence: Recurrence
  until: Date | null
  startDate: Date
}

export type AttachmentState = {
  list: TransactionAttachment[]
  preview: TransactionAttachment | null
  fileToOpen: TransactionAttachment | null
  toRemove: TransactionAttachment | null
  addFilesExpanded: boolean
}
