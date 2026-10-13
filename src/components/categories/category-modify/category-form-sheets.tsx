import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import type { BudgetLosingLastCategory } from "~/database/services/category-service"
import type { Category } from "~/types/categories"

interface CategoryFormSheetsProps {
  deleteSheetVisible: boolean
  unsavedSheetVisible: boolean
  isAddMode: boolean
  category: Category | undefined
  /** Active budgets that deleting the category would switch off. */
  budgetsLosingCategory: BudgetLosingLastCategory[]
  onCloseDeleteSheet: () => void
  onCloseUnsavedSheet: () => void
  onConfirmDelete: () => void
  onDiscardAndNavigate: () => void
}

export function CategoryFormSheets({
  deleteSheetVisible,
  unsavedSheetVisible,
  isAddMode,
  category,
  budgetsLosingCategory,
  onCloseDeleteSheet,
  onCloseUnsavedSheet,
  onConfirmDelete,
  onDiscardAndNavigate,
}: CategoryFormSheetsProps) {
  const { t } = useTranslation()
  // A category that transactions use cannot be deleted at all, so the budget
  // warning only matters once the delete can go ahead.
  const warnAboutBudgets =
    (category?.transactionCount ?? 0) === 0 && budgetsLosingCategory.length > 0

  return (
    <>
      {!isAddMode && category && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={onCloseDeleteSheet}
          onConfirm={onConfirmDelete}
          title={t("components.categories.form.deleteSheet.title", {
            name: category.name,
          })}
          description={
            category.transactionCount > 0
              ? t(
                  "components.categories.form.deleteSheet.descriptionWithCount",
                  { count: category.transactionCount },
                )
              : warnAboutBudgets
                ? t(
                    "components.categories.form.deleteSheet.descriptionBudgets",
                    {
                      count: budgetsLosingCategory.length,
                      names: budgetsLosingCategory
                        .map((b) => b.name)
                        .join(", "),
                    },
                  )
                : t("components.categories.form.deleteSheet.descriptionEmpty")
          }
          confirmLabel={
            warnAboutBudgets
              ? t("components.categories.form.deleteSheet.deleteAnyway")
              : t("common.actions.delete")
          }
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash-outline"
        />
      )}

      <ConfirmSheet
        visible={unsavedSheetVisible}
        onRequestClose={onCloseUnsavedSheet}
        onConfirm={onDiscardAndNavigate}
        title={t("common.sheets.closeWithoutSaving")}
        description={t("common.sheets.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />
    </>
  )
}
