import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import type { Category } from "~/types/categories"

interface CategoryFormSheetsProps {
  deleteSheetVisible: boolean
  unsavedSheetVisible: boolean
  isAddMode: boolean
  category: Category | undefined
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
  onCloseDeleteSheet,
  onCloseUnsavedSheet,
  onConfirmDelete,
  onDiscardAndNavigate,
}: CategoryFormSheetsProps) {
  const { t } = useTranslation()

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
              : t("components.categories.form.deleteSheet.descriptionEmpty")
          }
          confirmLabel={t("common.actions.delete")}
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
