import { useTranslation } from "react-i18next"

import { TypeInline } from "~/components/type-inline"
import type { CategoryType } from "~/types/categories"

interface CategoryTypeInlineProps {
  selectedType: CategoryType
  onTypeSelected: (type: CategoryType) => void
  /** When false, the row is not tappable and no chevron is shown (e.g. edit mode). */
  editable?: boolean
}

/** Category type (expense / income) selector row. */
export function CategoryTypeInline(props: CategoryTypeInlineProps) {
  const { t } = useTranslation()
  return (
    <TypeInline
      {...props}
      icon="arrows-diff-outline"
      label={t("components.categories.form.typeLabel")}
      options={[
        { type: "expense", label: t("components.categories.types.expense") },
        { type: "income", label: t("components.categories.types.income") },
      ]}
    />
  )
}
