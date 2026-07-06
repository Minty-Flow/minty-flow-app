import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useUnistyles } from "react-native-unistyles"

import { MonthGrid } from "~/components/month-grid"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import {
  DateTimePickerModal,
  useDateTimePicker,
} from "~/components/ui/date-time-picker"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { formatLoanDate } from "~/utils/time-utils"

import { dateRangePresetModalStyles as styles } from "./date-range-preset-modal.styles"
import { PRESETS } from "./presets"
import type {
  DateRangePresetModalContentProps,
  ExpandedSection,
  PresetButtonId,
  PresetOption,
} from "./types"

export const DateRangePresetModalContent = ({
  initialStart,
  initialEnd,
  onSave,
  onRequestClose,
}: DateRangePresetModalContentProps) => {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const now = new Date()

  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null)

  /** Custom range */
  const [customRange, setCustomRange] = useState(() => ({
    start: initialStart ?? now,
    end: initialEnd ?? now,
  }))

  /** Month picker */
  const [monthState, setMonthState] = useState(() => ({
    year: now.getFullYear(),
    yearInput: String(now.getFullYear()),
    month: now.getMonth(),
  }))

  /** Year picker */
  const [byYearInput, setByYearInput] = useState(() =>
    String(now.getFullYear()),
  )

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

  const toggleSection = useCallback((section: ExpandedSection) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }, [])

  const handlePresetSelect = useCallback(
    (preset: PresetOption) => {
      const { start, end } = preset.getRange()
      onSave(start, end, preset.id)
      onRequestClose()
    },
    [onSave, onRequestClose],
  )

  const handleByMonthSelect = useCallback((monthIndex: number) => {
    setMonthState((s) => ({ ...s, month: monthIndex }))
  }, [])

  const handleByYearNow = useCallback(() => {
    setByYearInput(String(now.getFullYear()))
  }, [now])

  const handleByMonthNow = useCallback(() => {
    const y = now.getFullYear()
    setMonthState({
      year: y,
      yearInput: String(y),
      month: now.getMonth(),
    })
  }, [now])

  const handleByMonthYearChange = useCallback((year: number) => {
    setMonthState((s) => ({ ...s, year, yearInput: String(year) }))
  }, [])

  const handleByMonthYearInputChange = useCallback((val: string) => {
    setMonthState((s) => ({ ...s, yearInput: val }))
  }, [])

  const handleByMonthDone = useCallback(() => {
    const d = new Date(monthState.year, monthState.month, 1)
    onSave(startOfMonth(d), endOfMonth(d), "byMonth")
    onRequestClose()
  }, [monthState, onSave, onRequestClose])

  const handleByYearDone = useCallback(() => {
    const y = Number.parseInt(byYearInput, 10)
    const year =
      Number.isFinite(y) && y >= 1970 && y <= 2100 ? y : now.getFullYear()
    const d = new Date(year, 0, 1)
    onSave(startOfYear(d), endOfYear(d), "byYear")
    onRequestClose()
  }, [byYearInput, now, onSave, onRequestClose])

  const handleCustomDone = useCallback(() => {
    const start =
      customRange.start < customRange.end ? customRange.start : customRange.end
    const end =
      customRange.start < customRange.end ? customRange.end : customRange.start
    onSave(startOfDay(start), endOfDay(end), "custom")
    onRequestClose()
  }, [customRange, onSave, onRequestClose])

  const mutedColor = theme.colors.semantic?.semi ?? theme.colors.onSurface

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Text variant="h3" style={styles.headerTitle}>
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

        {/* MONTH SECTION */}

        <View style={styles.collapsibleSection}>
          <Pressable
            onPress={() => toggleSection("byMonth")}
            style={styles.rowBase}
          >
            <Text variant="default" style={styles.rowText}>
              {t("common.timePeriods.month")}
            </Text>

            <ChevronIcon
              direction={expandedSection === "byMonth" ? "down" : "trailing"}
              size={20}
              color={mutedColor}
            />
          </Pressable>

          {expandedSection === "byMonth" && (
            <View style={styles.expandedContent}>
              <MonthGrid
                year={monthState.year}
                yearInput={monthState.yearInput}
                month={monthState.month}
                onYearInputChange={handleByMonthYearInputChange}
                onYearChange={handleByMonthYearChange}
                onMonthChange={handleByMonthSelect}
                showYearChevrons
                onNow={handleByMonthNow}
                onDone={handleByMonthDone}
              />
            </View>
          )}
        </View>

        {/* YEAR SECTION */}

        <View style={styles.collapsibleSection}>
          <Pressable
            onPress={() => toggleSection("byYear")}
            style={styles.rowBase}
          >
            <Text variant="default" style={styles.rowText}>
              {t("common.timePeriods.year")}
            </Text>

            <ChevronIcon
              direction={expandedSection === "byYear" ? "down" : "trailing"}
              size={20}
              color={mutedColor}
            />
          </Pressable>

          {expandedSection === "byYear" && (
            <View style={styles.expandedContent}>
              <Text variant="small" style={styles.sectionLabel}>
                {t("components.dateRange.yearPlaceholder")}
              </Text>

              <Input
                value={byYearInput}
                onChangeText={(val) => {
                  const digits = val.replace(/\D/g, "").slice(0, 4)
                  setByYearInput(digits)
                }}
                keyboardType="number-pad"
                maxLength={4}
                placeholder={t("components.dateRange.yearInputPlaceholder")}
              />

              <View style={styles.actionsRow}>
                <Button variant="secondary" onPress={handleByYearNow}>
                  <Text variant="default">{t("components.dateRange.now")}</Text>
                </Button>

                <Button variant="secondary" onPress={handleByYearDone}>
                  <Text variant="default">{t("common.actions.done")}</Text>
                </Button>
              </View>
            </View>
          )}
        </View>

        {/* CUSTOM RANGE */}

        <View style={styles.collapsibleSection}>
          <Pressable
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
          </Pressable>

          {expandedSection === "custom" && (
            <View style={styles.expandedContentCompact}>
              <Pressable
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
              </Pressable>

              <Pressable
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
              </Pressable>

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

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Button variant="outline" onPress={onRequestClose} style={{ flex: 1 }}>
          <Text variant="default">{t("common.actions.cancel")}</Text>
        </Button>
      </View>

      {startDatePicker.pickerElement}
      {endDatePicker.pickerElement}
      <DateTimePickerModal
        {...startDatePicker.modalProps}
        title={t("components.dateRange.startDate")}
      />

      <DateTimePickerModal
        {...endDatePicker.modalProps}
        title={t("components.dateRange.endDate")}
      />
    </View>
  )
}
