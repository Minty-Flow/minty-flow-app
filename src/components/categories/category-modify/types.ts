import type { Category, CategoryType } from "~/types/categories"

export interface CategoryModifyContentProps {
  categoryModifyId: string
  initialType?: CategoryType
  category?: Category
}
