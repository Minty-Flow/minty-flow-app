import type { Category } from "~/types/categories"
import type { TransactionType } from "~/types/transactions"

export interface CategoryModifyContentProps {
  categoryModifyId: string
  initialType?: TransactionType
  category?: Category
}
