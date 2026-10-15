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
  onConfirmDelete: () => Promise<boolean | undefined>
  onDeleted: () => void
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
  onDeleted,
  onDiscardAndNavigate,
}: CategoryFormSheetsProps) {
  const { t } = useTranslation()
  const warnAboutBudgets = budgetsLosingCategory.length > 0
  const transactionCount = category?.transactionCount ?? 0
  const usageText =
    transactionCount > 0
      ? t("components.categories.form.deleteSheet.descriptionWithCount", {
          count: transactionCount,
        })
      : t("components.categories.form.deleteSheet.descriptionEmpty")
  const budgetsText = warnAboutBudgets
    ? t("components.categories.form.deleteSheet.descriptionBudgets", {
        count: budgetsLosingCategory.length,
        names: budgetsLosingCategory.map((b) => b.name).join(", "),
      })
    : null

  return (
    <>
      {!isAddMode && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={onCloseDeleteSheet}
          onConfirm={onConfirmDelete}
          onConfirmed={onDeleted}
          title={t("components.categories.form.deleteSheet.title", {
            name: category?.name,
          })}
          description={budgetsText ? `${usageText} ${budgetsText}` : usageText}
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
        onConfirm={() => undefined}
        onConfirmed={onDiscardAndNavigate}
        title={t("common.sheets.closeWithoutSaving")}
        description={t("common.sheets.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />
    </>
  )
}
