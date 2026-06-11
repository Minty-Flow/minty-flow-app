import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
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
  RecurringFrequency,
  TransactionAttachment,
  TransactionSubType,
  TransactionType,
} from "~/types/transactions"

export type DatePickerTarget = "transaction" | "recurringStart" | "recurringEnd"

export interface TransactionFormV3Props {
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
  initialSubtype?: TransactionSubType // Added
  prefill?: Partial<TransactionFormValues>
  onSubtypeChange: (subtype: TransactionSubType | null) => void // Added
}

export type ModalState = {
  unsavedModalVisible: boolean
  editRecurringModalVisible: boolean
  deleteRecurringModalVisible: boolean
  destroyModalVisible: boolean
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
  enabled: boolean
  frequency: RecurringFrequency
  startDate: Date
  endDate: Date | null
  endAfterOccurrences: number | null
  endsOnPickerExpanded: boolean
}

export type AttachmentState = {
  list: TransactionAttachment[]
  preview: TransactionAttachment | null
  fileToOpen: TransactionAttachment | null
  toRemove: TransactionAttachment | null
  addFilesExpanded: boolean
}
