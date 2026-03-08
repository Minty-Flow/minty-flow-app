import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
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
import { Modal, Platform, ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import type { DateRangePresetId } from "~/utils/time-utils"
import { formatLoanDate, getMonthNames } from "~/utils/time-utils"

import { dateRangePresetModalStyles as styles } from "./date-range-preset-modal.styles"
import { PRESETS } from "./presets"
import type {
  ActiveSource,
  DateRangePresetModalContentProps,
  ExpandedSection,
  PresetButtonId,
  PresetOption,
} from "./types"

// TODO: redo this component to be aligned with src/components/month-year-picker.tsx
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

  const [selectedPresetId, setSelectedPresetId] =
    useState<DateRangePresetId | null>(null)

  const [activeSource, setActiveSource] = useState<ActiveSource>("preset")
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

  const [iosPickerTarget, setIosPickerTarget] = useState<
    "start" | "end" | null
  >(null)

  const toggleSection = useCallback((section: ExpandedSection) => {
    setExpandedSection((prev) => (prev === section ? null : section))

    if (section) {
      if (section === "byMonth") setActiveSource("byMonth")
      else if (section === "byYear") setActiveSource("byYear")
      else setActiveSource("custom")
    }
  }, [])

  const openNativePicker = useCallback(
    (target: "start" | "end") => {
      const value = target === "start" ? customRange.start : customRange.end

      if (Platform.OS === "android") {
        DateTimePickerAndroid.open({
          value,
          mode: "date",
          display: "calendar",
          onChange: (_evt: DateTimePickerEvent, selectedDate?: Date) => {
            if (selectedDate && _evt.type === "set") {
              setCustomRange((prev) => {
                if (target === "start") {
                  return {
                    start: selectedDate,
                    end: selectedDate > prev.end ? selectedDate : prev.end,
                  }
                }
                return {
                  start: selectedDate < prev.start ? selectedDate : prev.start,
                  end: selectedDate,
                }
              })
            }
          },
        })
      } else {
        setIosPickerTarget(target)
      }
    },
    [customRange],
  )

  const handleIosDateChange = useCallback(
    (target: "start" | "end") =>
      (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
          setCustomRange((prev) => {
            if (target === "start") {
              return {
                start: selectedDate,
                end: selectedDate > prev.end ? selectedDate : prev.end,
              }
            }

            return {
              start: selectedDate < prev.start ? selectedDate : prev.start,
              end: selectedDate,
            }
          })
        }

        setIosPickerTarget(null)
      },
    [],
  )

  const handlePresetSelect = useCallback((preset: PresetOption) => {
    setSelectedPresetId(preset.id)
    setActiveSource("preset")
    setExpandedSection(null)
  }, [])

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

  const getSaveRange = useCallback((): { start: Date; end: Date } => {
    if (activeSource === "preset" && selectedPresetId) {
      const preset = PRESETS.find((p) => p.id === selectedPresetId)
      if (preset) return preset.getRange()
    }

    if (activeSource === "byMonth") {
      const d = new Date(monthState.year, monthState.month, 1)
      return { start: startOfMonth(d), end: endOfMonth(d) }
    }

    if (activeSource === "byYear") {
      const y = Number.parseInt(byYearInput, 10)
      const year =
        Number.isFinite(y) && y >= 1970 && y <= 2100 ? y : now.getFullYear()

      const d = new Date(year, 0, 1)

      return { start: startOfYear(d), end: endOfYear(d) }
    }

    const start =
      customRange.start < customRange.end ? customRange.start : customRange.end

    const end =
      customRange.start < customRange.end ? customRange.end : customRange.start

    return {
      start: startOfDay(start),
      end: endOfDay(end),
    }
  }, [
    activeSource,
    selectedPresetId,
    monthState,
    byYearInput,
    now,
    customRange,
  ])

  const handleSave = useCallback(() => {
    const { start, end } = getSaveRange()
    onSave(start, end)
    onRequestClose()
  }, [getSaveRange, onSave, onRequestClose])

  const MONTH_NAMES = getMonthNames()

  const mutedColor = theme.colors.customColors?.semi ?? theme.colors.onSurface
  const fgColor = theme.colors.onSurface

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
          {PRESETS.map((preset) => {
            const isSelected =
              activeSource === "preset" && selectedPresetId === preset.id

            return (
              <Pressable
                key={preset.id}
                onPress={() => handlePresetSelect(preset)}
                style={[
                  styles.presetButton,
                  isSelected && styles.presetButtonSelected,
                ]}
              >
                <Text
                  variant="default"
                  numberOfLines={1}
                  style={[
                    styles.presetButtonText,
                    isSelected && styles.presetButtonTextSelected,
                  ]}
                >
                  {t(
                    `components.dateRange.presets.${preset.id as PresetButtonId}`,
                  )}
                </Text>
              </Pressable>
            )
          })}
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
              <View style={styles.monthYearRow}>
                <Button
                  variant="secondary"
                  size="icon"
                  hitSlop={8}
                  onPress={() => {
                    const next = Math.max(1970, monthState.year - 1)

                    setMonthState((s) => ({
                      ...s,
                      year: next,
                      yearInput: String(next),
                    }))
                  }}
                >
                  <ChevronIcon direction="leading" size={24} color={fgColor} />
                </Button>

                <Input
                  value={monthState.yearInput}
                  onChangeText={(val) => {
                    const digits = val.replace(/\D/g, "").slice(0, 4)

                    setMonthState((s) => ({
                      ...s,
                      yearInput: digits,
                      year: Number.isNaN(Number.parseInt(digits, 10))
                        ? s.year
                        : Math.min(
                            2100,
                            Math.max(1970, Number.parseInt(digits, 10)),
                          ),
                    }))
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder={t("components.dateRange.yearInputPlaceholder")}
                  style={styles.monthYearInput}
                />

                <Button
                  variant="secondary"
                  hitSlop={8}
                  size="icon"
                  onPress={() => {
                    const next = Math.min(2100, monthState.year + 1)

                    setMonthState((s) => ({
                      ...s,
                      year: next,
                      yearInput: String(next),
                    }))
                  }}
                >
                  <ChevronIcon direction="trailing" size={24} color={fgColor} />
                </Button>
              </View>

              <View style={styles.monthGrid}>
                {MONTH_NAMES.map((name, idx) => {
                  const isSelected = monthState.month === idx

                  return (
                    <Pressable
                      key={name}
                      onPress={() => handleByMonthSelect(idx)}
                      style={[
                        styles.monthCell,
                        isSelected && styles.monthCellSelected,
                      ]}
                    >
                      <Text
                        variant="default"
                        style={[
                          styles.monthCellText,
                          isSelected && styles.monthCellTextSelected,
                        ]}
                      >
                        {name}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>

              <Button
                variant="secondary"
                onPress={handleByMonthNow}
                style={{ alignSelf: "flex-end" }}
              >
                <Text variant="default">{t("components.dateRange.now")}</Text>
              </Button>
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

              <Button
                variant="secondary"
                onPress={handleByYearNow}
                style={{ alignSelf: "flex-end" }}
              >
                <Text variant="default">{t("components.dateRange.now")}</Text>
              </Button>
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
                onPress={() => openNativePicker("start")}
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
                onPress={() => openNativePicker("end")}
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
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Button variant="outline" onPress={onRequestClose} style={{ flex: 1 }}>
          <Text variant="default">{t("common.actions.cancel")}</Text>
        </Button>

        <Button variant="default" onPress={handleSave} style={{ flex: 1 }}>
          <Text variant="default">{t("common.actions.save")}</Text>
        </Button>
      </View>

      {Platform.OS === "ios" && iosPickerTarget !== null && (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setIosPickerTarget(null)}
        >
          <Pressable
            style={styles.iosPickerOverlay}
            onPress={() => setIosPickerTarget(null)}
          >
            <Pressable
              style={[
                styles.iosPickerSheet,
                { paddingBottom: insets.bottom + 16 },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.iosPickerHeader}>
                <Pressable
                  onPress={() => setIosPickerTarget(null)}
                  hitSlop={12}
                >
                  <Text variant="default" style={styles.mutedText}>
                    {t("common.actions.cancel")}
                  </Text>
                </Pressable>

                <Text variant="default" style={styles.iosPickerHeaderTitle}>
                  {iosPickerTarget === "start"
                    ? t("components.dateRange.startDate")
                    : t("components.dateRange.endDate")}
                </Text>

                <Pressable
                  onPress={() => setIosPickerTarget(null)}
                  hitSlop={12}
                >
                  <Text variant="default" style={styles.iosPickerDone}>
                    {t("common.actions.done")}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={
                    iosPickerTarget === "start"
                      ? customRange.start
                      : customRange.end
                  }
                  mode="date"
                  display="spinner"
                  onChange={handleIosDateChange(iosPickerTarget)}
                  textColor={fgColor}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  )
}
