import type { RecurringEditPayload } from "~/components/transaction/edit-recurring-modal"
import type TransactionModel from "~/database/models/transaction"
import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Tag } from "~/types/tags"
import type {
  RecurringFrequency,
  TransactionAttachment,
  TransactionType,
} from "~/types/transactions"

export type DatePickerTarget = "transaction" | "recurringStart" | "recurringEnd"

export interface TransactionFormV3Props {
  transaction: TransactionModel | null
  accounts: Account[]
  categories: Category[]
  tags: Tag[]
  transactionType: TransactionType
  onTransactionTypeChange: (type: TransactionType) => void
  initialTagIds?: string[]
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
