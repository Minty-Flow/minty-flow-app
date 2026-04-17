import { useTranslation } from "react-i18next"
import { EnrichedTextInput } from "react-native-enriched"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { NotesModal } from "~/components/transaction/notes-modal"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"

import { transactionFormStyles } from "./form.styles"

type Props = {
  description: string | null | undefined
  descriptionErrorKey: string | undefined
  notesModalVisible: boolean
  onOpenModal: () => void
  onCloseModal: () => void
  onSave: (html: string) => void
}

export function FormNotesSection({
  description,
  descriptionErrorKey,
  notesModalVisible,
  onOpenModal,
  onCloseModal,
  onSave,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <Text variant="small" style={transactionFormStyles.sectionLabel}>
        {t("components.transactionForm.fields.notes")}
      </Text>
      <Pressable
        style={transactionFormStyles.notesPressable}
        onPress={onOpenModal}
        accessibilityLabel={t("components.transactionForm.fields.notes")}
        accessibilityHint={t("components.transactionForm.a11y.openNotesEditor")}
      >
        <View style={transactionFormStyles.notesHeaderRow}>
          <DynamicIcon
            icon="clipboard"
            size={20}
            color={theme.colors.primary}
            variant="badge"
          />
          <Text
            variant="default"
            style={
              description?.trim()
                ? transactionFormStyles.fieldValue
                : transactionFormStyles.fieldPlaceholder
            }
            numberOfLines={1}
          >
            {description?.trim()
              ? t("components.transactionForm.fields.tapToEditNotes")
              : t("components.transactionForm.fields.addNotes")}
          </Text>
          <ChevronIcon
            direction="trailing"
            size={20}
            style={transactionFormStyles.chevronIcon}
          />
        </View>
        {description?.trim() ? (
          <View
            style={transactionFormStyles.notesFullPreviewWrap}
            pointerEvents="none"
          >
            <EnrichedTextInput
              key={description}
              defaultValue={description}
              editable={false}
              scrollEnabled={false}
              style={{
                color: theme.colors.onSurface,
                backgroundColor: "transparent",
                fontSize: theme.typography.labelLarge.fontSize,
              }}
              htmlStyle={{
                ul: { bulletColor: theme.colors.onSurface },
                ol: { markerColor: theme.colors.onSurface },
                ulCheckbox: { boxColor: theme.colors.onSurface },
              }}
            />
          </View>
        ) : null}
      </Pressable>
      {descriptionErrorKey ? (
        <Text style={transactionFormStyles.fieldError}>
          {t(descriptionErrorKey as TranslationKey)}
        </Text>
      ) : null}

      <NotesModal
        visible={notesModalVisible}
        initialValue={description ?? ""}
        onSave={onSave}
        onRequestClose={onCloseModal}
      />
    </View>
  )
}
