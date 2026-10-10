import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { sheetHeaderStyles } from "~/components/selectors/styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

export const MIN_YEAR = 1970
export const MAX_YEAR = 2100

export function clampYear(year: number): number {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, year))
}

type Props = {
  visible: boolean
  year: number
  onSelect: (year: number) => void
  onClose: () => void
}

/** "Select a year": a number field with Now / Done. Can stack over another sheet. */
export function YearPickerSheet(props: Props) {
  // Mounted only while open so the field starts from the current year each time.
  if (!props.visible) return null
  return <YearPickerSheetInner {...props} />
}

function YearPickerSheetInner({
  year,
  onSelect,
  onClose,
}: Omit<Props, "visible">) {
  const { t } = useTranslation()
  const [input, setInput] = useState(String(year))

  const handleChange = (value: string) => {
    // Accept Arabic-Indic digits too.
    const normalized = value.replace(/[٠-٩]/g, (d) =>
      String(d.charCodeAt(0) - 0x0660),
    )
    setInput(normalized.replace(/\D/g, "").slice(0, 4))
  }

  const handleDone = () => {
    const parsed = Number.parseInt(input, 10)
    onSelect(clampYear(Number.isFinite(parsed) ? parsed : year))
    onClose()
  }

  return (
    <BottomSheet isPresented onDismiss={onClose}>
      <View style={styles.container}>
        <View style={sheetHeaderStyles.header}>
          <Text style={sheetHeaderStyles.title}>
            {t("components.dateRange.yearPlaceholder")}
          </Text>
        </View>

        <Input
          value={input}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={4}
          autoFocus
          selectTextOnFocus
          placeholder={t("components.dateRange.yearInputPlaceholder")}
          onSubmitEditing={handleDone}
        />

        <View style={styles.actions}>
          <Button
            variant="ghost"
            onPress={() => setInput(String(new Date().getFullYear()))}
          >
            <Text variant="default">{t("components.dateRange.now")}</Text>
          </Button>
          <Button variant="secondary" onPress={handleDone}>
            <Text variant="default">{t("common.actions.done")}</Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create(() => ({
  container: { gap: 12, paddingBottom: 8 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
}))
