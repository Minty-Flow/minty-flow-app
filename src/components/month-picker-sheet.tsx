import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { sheetHeaderStyles } from "~/components/selectors/styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { clampYear, YearPickerSheet } from "~/components/year-picker-sheet"
import { getMonthNames } from "~/utils/time-utils"

type Props = {
  visible: boolean
  year: number
  /** 0-11 */
  month: number
  onSelect: (year: number, month: number) => void
  onClose: () => void
  /**
   * Future months are dimmed and can't be picked unless this is true (e.g. the
   * scheduled-transactions screen, which is all about the future).
   */
  allowFuture?: boolean
}

/**
 * "Select a month": year row (tap the year to open the year picker on top of
 * this sheet), month grid, Now / Done. Edits a draft; Done applies it.
 */
export function MonthPickerSheet(props: Props) {
  // Mounted only while open so the draft restarts from the current value.
  if (!props.visible) return null
  return <MonthPickerSheetInner {...props} />
}

function MonthPickerSheetInner({
  year,
  month,
  onSelect,
  onClose,
  allowFuture = false,
}: Omit<Props, "visible">) {
  const { t } = useTranslation()
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const [draftYear, setDraftYear] = useState(year)
  const [draftMonth, setDraftMonth] = useState(month)
  const [yearSheetVisible, setYearSheetVisible] = useState(false)
  const monthNames = getMonthNames()

  const isFutureMonth = (y: number, m: number) =>
    !allowFuture && (y > currentYear || (y === currentYear && m > currentMonth))

  // Moving to a year makes the picked month "future" -> pull it back to now.
  const changeYear = (next: number) => {
    const y = allowFuture ? next : Math.min(next, currentYear)
    setDraftYear(y)
    if (isFutureMonth(y, draftMonth)) setDraftMonth(currentMonth)
  }

  const handleNow = () => {
    setDraftYear(currentYear)
    setDraftMonth(currentMonth)
  }

  const handleDone = () => {
    onSelect(draftYear, draftMonth)
    onClose()
  }

  return (
    <>
      <BottomSheet isPresented onDismiss={onClose}>
        <View style={styles.container}>
          <View style={sheetHeaderStyles.header}>
            <Text style={sheetHeaderStyles.title}>
              {t("components.dateRange.monthPickerTitle")}
            </Text>
          </View>

          <View style={styles.yearRow}>
            <Button
              variant="ghost"
              size="icon"
              hitSlop={8}
              onPress={() => changeYear(clampYear(draftYear - 1))}
            >
              <ChevronIcon direction="leading" size={24} />
            </Button>
            <Pressable
              style={styles.yearPill}
              onPress={() => setYearSheetVisible(true)}
            >
              <Text style={styles.yearText}>{draftYear}</Text>
            </Pressable>
            <Button
              variant="ghost"
              size="icon"
              hitSlop={8}
              disabled={!allowFuture && draftYear >= currentYear}
              onPress={() => changeYear(clampYear(draftYear + 1))}
            >
              <ChevronIcon direction="trailing" size={24} />
            </Button>
          </View>

          <View style={styles.grid}>
            {monthNames.map((name, index) => {
              const selected = index === draftMonth
              const dead = isFutureMonth(draftYear, index)
              return (
                <Pressable
                  key={name}
                  disabled={dead}
                  onPress={() => setDraftMonth(index)}
                  style={[
                    styles.cell,
                    selected && styles.cellSelected,
                    dead && styles.cellDead,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.cellText,
                      selected && styles.cellTextSelected,
                    ]}
                  >
                    {name}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.actions}>
            <Button variant="ghost" onPress={handleNow}>
              <Text variant="default">{t("components.dateRange.now")}</Text>
            </Button>
            <Button variant="secondary" onPress={handleDone}>
              <Text variant="default">{t("common.actions.done")}</Text>
            </Button>
          </View>
        </View>
      </BottomSheet>

      {/* Stacks on top of the month sheet. */}
      <YearPickerSheet
        visible={yearSheetVisible}
        year={draftYear}
        onSelect={changeYear}
        onClose={() => setYearSheetVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { gap: 16, paddingBottom: 8 },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  yearPill: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    paddingVertical: 10,
    borderRadius: theme.radius,
    alignItems: "center",
  },
  yearText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cell: {
    width: "31%",
    paddingVertical: 12,
    borderRadius: theme.radius,
    alignItems: "center",
  },
  // Future months: dimmed and inert.
  cellDead: {
    opacity: 0.3,
  },
  cellSelected: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  cellText: {
    color: theme.colors.onSurface,
    fontWeight: "400",
  },
  cellTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
}))
