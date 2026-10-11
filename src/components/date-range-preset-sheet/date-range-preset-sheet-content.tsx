import { endOfDay, startOfDay } from "date-fns"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { sheetHeaderStyles } from "~/components/selectors/styles"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import {
  DateTimePickerSheet,
  useDateTimePicker,
} from "~/components/ui/date-time-picker"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { formatLoanDate } from "~/utils/time-utils"

import { dateRangePresetSheetStyles as styles } from "./date-range-preset-sheet.styles"
import { PRESETS } from "./presets"
import type {
  DateRangePresetSheetContentProps,
  ExpandedSection,
  PresetButtonId,
  PresetOption,
} from "./types"
export const DateRangePresetSheetContent = ({
  initialStart,
  initialEnd,
  onSave,
  onRequestClose,
  onPickMonth,
  onPickYear,
}: DateRangePresetSheetContentProps) => {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const now = new Date()
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null)
  /** Custom range */
  const [customRange, setCustomRange] = useState(() => ({
    start: initialStart ?? now,
    end: initialEnd ?? now,
  }))
  const startDatePicker = useDateTimePicker({
    onConfirm: (date) =>
      setCustomRange((prev) => ({
        start: date,
        end: date > prev.end ? date : prev.end,
      })),
  })
  const endDatePicker = useDateTimePicker({
    onConfirm: (date) =>
      setCustomRange((prev) => ({
        start: date < prev.start ? date : prev.start,
        end: date,
      })),
  })
  const toggleSection = (section: ExpandedSection) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }
  const handlePresetSelect = (preset: PresetOption) => {
    const { start, end } = preset.getRange()
    onSave(start, end, preset.id)
    onRequestClose()
  }
  const handleCustomDone = () => {
    const start =
      customRange.start < customRange.end ? customRange.start : customRange.end
    const end =
      customRange.start < customRange.end ? customRange.end : customRange.start
    onSave(startOfDay(start), endOfDay(end), "custom")
    onRequestClose()
  }
  const mutedColor = theme.colors.semantic?.semi ?? theme.colors.onSurface
  return (
    <View style={styles.container}>
      <View style={sheetHeaderStyles.header}>
        <Text style={sheetHeaderStyles.title}>
          {t("components.dateRange.title")}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <Text variant="small" style={styles.sectionLabelCommonOptions}>
          {t("components.dateRange.commonOptions")}
        </Text>

        <View style={styles.presetsRow}>
          {PRESETS.map((preset) => (
            <Pressable
              key={preset.id}
              onPress={() => handlePresetSelect(preset)}
              style={styles.presetButton}
            >
              <Text
                variant="default"
                numberOfLines={1}
                style={styles.presetButtonText}
              >
                {t(
                  `components.dateRange.presets.${preset.id as PresetButtonId}`,
                )}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* MONTH / YEAR: each opens its own sheet */}

        <View style={styles.collapsibleSection}>
          <ListItem onPress={onPickMonth} style={styles.rowBase}>
            <Text variant="default" style={styles.rowText}>
              {t("common.timePeriods.month")}
            </Text>
            <ChevronIcon direction="trailing" size={20} color={mutedColor} />
          </ListItem>
        </View>

        <View style={styles.collapsibleSection}>
          <ListItem onPress={onPickYear} style={styles.rowBase}>
            <Text variant="default" style={styles.rowText}>
              {t("common.timePeriods.year")}
            </Text>
            <ChevronIcon direction="trailing" size={20} color={mutedColor} />
          </ListItem>
        </View>

        {/* CUSTOM RANGE */}

        <View style={styles.collapsibleSection}>
          <ListItem
            onPress={() => toggleSection("custom")}
            style={styles.rowBase}
          >
            <Text variant="default" style={styles.rowText}>
              {t("components.dateRange.customRange")}
            </Text>

            <ChevronIcon
              direction={expandedSection === "custom" ? "down" : "trailing"}
              size={20}
              color={mutedColor}
            />
          </ListItem>

          {expandedSection === "custom" && (
            <View style={styles.expandedContentCompact}>
              <ListItem
                onPress={() => startDatePicker.open(customRange.start)}
                style={styles.customRangeRow}
              >
                <Text variant="default" style={styles.rowText}>
                  {t("components.dateRange.startDate")}
                </Text>

                <View style={styles.customRangeValue}>
                  <Text variant="default" style={styles.customRangeValueText}>
                    {formatLoanDate(customRange.start)}
                  </Text>

                  <ChevronIcon
                    direction="trailing"
                    size={18}
                    color={mutedColor}
                  />
                </View>
              </ListItem>

              <ListItem
                onPress={() => endDatePicker.open(customRange.end)}
                style={styles.customRangeRow}
              >
                <Text variant="default" style={styles.rowText}>
                  {t("components.dateRange.endDate")}
                </Text>

                <View style={styles.customRangeValue}>
                  <Text variant="default" style={styles.customRangeValueText}>
                    {formatLoanDate(customRange.end)}
                  </Text>

                  <ChevronIcon
                    direction="trailing"
                    size={18}
                    color={mutedColor}
                  />
                </View>
              </ListItem>

              <View
                style={[
                  styles.actionsRow,
                  { paddingHorizontal: 20, paddingTop: 8 },
                ]}
              >
                <Button variant="secondary" onPress={handleCustomDone}>
                  <Text variant="default">{t("common.actions.done")}</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button variant="outline" onPress={onRequestClose} style={{ flex: 1 }}>
          <Text variant="default">{t("common.actions.cancel")}</Text>
        </Button>
      </View>

      {startDatePicker.pickerElement}
      {endDatePicker.pickerElement}
      <DateTimePickerSheet
        {...startDatePicker.sheetProps}
        title={t("components.dateRange.startDate")}
      />

      <DateTimePickerSheet
        {...endDatePicker.sheetProps}
        title={t("components.dateRange.endDate")}
      />
    </View>
  )
}
