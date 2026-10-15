import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import type { Tag } from "~/types/tags"

interface FormTagSheetsProps {
  deleteSheetVisible: boolean
  setDeleteSheetVisible: (visible: boolean) => void
  tag?: Tag
  handleDelete: () => Promise<boolean | undefined>
  onDeleted: () => void
  unsavedSheetVisible: boolean
  setUnsavedSheetVisible: (visible: boolean) => void
  allowNavigation: () => void
  handleConfirm: () => void
}

export const FormTagSheets = ({
  deleteSheetVisible,
  setDeleteSheetVisible,
  tag,
  handleDelete,
  onDeleted,
  unsavedSheetVisible,
  setUnsavedSheetVisible,
  allowNavigation,
  handleConfirm,
}: FormTagSheetsProps) => {
  const { t } = useTranslation()

  return (
    <>
      {tag && (
        <ConfirmSheet
          visible={deleteSheetVisible}
          onRequestClose={() => setDeleteSheetVisible(false)}
          onConfirm={handleDelete}
          onConfirmed={onDeleted}
          title={t("screens.settings.tags.form.deleteSheet.title", {
            name: tag.name,
          })}
          description={
            (tag.transactionCount ?? 0) > 0
              ? t(
                  "screens.settings.tags.form.deleteSheet.descriptionWithCount",
                  { count: tag.transactionCount ?? 0 },
                )
              : t("screens.settings.tags.form.deleteSheet.descriptionEmpty")
          }
          confirmLabel={t("common.actions.delete")}
          cancelLabel={t("common.actions.cancel")}
          variant="destructive"
          icon="trash-outline"
        />
      )}

      <ConfirmSheet
        visible={unsavedSheetVisible}
        onRequestClose={() => setUnsavedSheetVisible(false)}
        onConfirm={() => undefined}
        onConfirmed={() => {
          allowNavigation()
          handleConfirm()
        }}
        title={t("common.sheets.closeWithoutSaving")}
        description={t("common.sheets.unsavedDescription")}
        confirmLabel={t("common.actions.discard")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
      />
    </>
  )
}
