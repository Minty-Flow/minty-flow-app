import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { Keyboard } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getDisplayMonthTitle, getMonthNames } from "~/utils/time-utils"

interface MonthYearPickerProps {
  initialYear: number
  initialMonth: number
  onSelect: (year: number, month: number) => void
  onNow?: () => void
  onDone?: () => void
}

const MIN_YEAR = 1970
const MAX_YEAR = 2100

function clampYear(y: number) {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, y))
}

export function MonthYearPicker({
  initialYear,
  initialMonth,
  onSelect,
  onNow,
  onDone,
}: MonthYearPickerProps) {
  const { t } = useTranslation()

  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const [localYear, setLocalYear] = useState(() => initialYear)
  const [localMonth, setLocalMonth] = useState(() => initialMonth)
  const [yearInputValue, setYearInputValue] = useState(() =>
    String(initialYear),
  )

  const MONTH_NAMES = getMonthNames()

  const displayMonthName = getDisplayMonthTitle(localYear, localMonth)

  const goPrevMonth = useCallback(() => {
    if (localMonth === 0) {
      const newYear = clampYear(localYear - 1)
      setLocalMonth(11)
      setLocalYear(newYear)
      setYearInputValue(String(newYear))
      onSelect(newYear, 11)
    } else {
      const newMonth = localMonth - 1
      setLocalMonth(newMonth)
      onSelect(localYear, newMonth)
    }
  }, [localMonth, localYear, onSelect])

  const goNextMonth = useCallback(() => {
    if (localMonth === 11) {
      const newYear = clampYear(localYear + 1)
      setLocalMonth(0)
      setLocalYear(newYear)
      setYearInputValue(String(newYear))
      onSelect(newYear, 0)
    } else {
      const newMonth = localMonth + 1
      setLocalMonth(newMonth)
      onSelect(localYear, newMonth)
    }
  }, [localMonth, localYear, onSelect])

  const handleMonthPress = useCallback((monthIndex: number) => {
    setLocalMonth(monthIndex)
  }, [])

  const handleNow = useCallback(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()

    setLocalYear(y)
    setLocalMonth(m)
    setYearInputValue(String(y))

    onNow?.()
  }, [onNow])

  const handleDone = useCallback(() => {
    Keyboard.dismiss()

    const y = clampYear(parseInt(yearInputValue, 10) || localYear)

    setLocalYear(y)
    setYearInputValue(String(y))

    onSelect(y, localMonth)
    onDone?.()

    setMonthPickerOpen(false)
  }, [yearInputValue, localYear, localMonth, onSelect, onDone])

  return (
    <>
      {/* Top Month Selector */}
      <View style={styles.topMonthRow}>
        <Button variant="secondary" size="icon" onPress={goPrevMonth}>
          <ChevronIcon direction="leading" size={24} />
        </Button>

        <Pressable
          style={styles.monthHeaderButton}
          onPress={() => setMonthPickerOpen((v) => !v)}
        >
          <Text style={styles.monthHeaderButtonText}>{displayMonthName}</Text>
        </Pressable>

        <Button variant="secondary" size="icon" onPress={goNextMonth}>
          <ChevronIcon direction="trailing" size={24} />
        </Button>
      </View>

      {/* Inline Picker */}
      {monthPickerOpen && (
        <View style={styles.monthPickerContainer}>
          <View style={styles.expandedContent}>
            <View style={styles.monthYearRow}>
              <Input
                value={yearInputValue}
                onChangeText={(text) => {
                  const normalized = text.replace(/[٠-٩]/g, (d) =>
                    String(d.charCodeAt(0) - 0x0660),
                  )
                  const digits = normalized.replace(/\D/g, "").slice(0, 4)
                  setYearInputValue(digits)

                  const num = parseInt(digits, 10)
                  if (!Number.isNaN(num)) {
                    setLocalYear(clampYear(num))
                  }
                }}
                keyboardType="number-pad"
                maxLength={4}
                placeholder={String(initialYear)}
                style={styles.yearInput}
                textAlign="center"
              />
            </View>

            <View style={styles.monthGrid}>
              {MONTH_NAMES.map((name, idx) => {
                const isSelected = localMonth === idx

                return (
                  <Pressable
                    key={name}
                    onPress={() => handleMonthPress(idx)}
                    style={[
                      styles.monthCell,
                      isSelected && styles.monthCellSelected,
                    ]}
                  >
                    <Text
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

            <View style={styles.actionsRow}>
              <Button variant="secondary" onPress={handleNow}>
                <Text>{t("components.dateRange.now")}</Text>
              </Button>

              <Button variant="secondary" onPress={handleDone}>
                <Text>{t("common.actions.done")}</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create((theme) => {
  const primary = theme.colors.primary

  return {
    topMonthRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      marginHorizontal: 20,
      marginTop: 8,
      paddingVertical: 6,
    },

    monthHeaderButton: {
      backgroundColor: theme.colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: theme.radius,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    monthHeaderButtonText: {
      ...theme.typography.titleSmall,
      fontWeight: "600",
      color: theme.colors.onSecondary,
    },

    monthPickerContainer: {
      marginHorizontal: 20,
      marginVertical: 8,
      // backgroundColor: theme.colors.secondary,
      // borderRadius: theme.radius,
      overflow: "hidden",
    },

    expandedContent: {
      padding: 20,
      paddingTop: 0,
      gap: 16,
    },

    monthYearRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },

    yearInput: {
      ...theme.typography.headlineSmall,
      fontWeight: "600",
      minWidth: 72,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
    },

    monthGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    monthCell: {
      width: "30%",
      paddingVertical: 10,
      borderRadius: theme.radius,
      alignItems: "center",
    },

    monthCellSelected: {
      backgroundColor: `${primary}20`,
    },

    monthCellText: {
      color: theme.colors.onSurface,
      fontWeight: "400",
    },

    monthCellTextSelected: {
      color: primary,
      fontWeight: "600",
    },

    actionsRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 12,
    },
  }
})
