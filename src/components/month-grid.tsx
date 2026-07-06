import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getMonthNames } from "~/utils/time-utils"

const MIN_YEAR = 1970
const MAX_YEAR = 2100

function clampYear(y: number) {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, y))
}

interface MonthGridProps {
  year: number
  yearInput: string
  month: number
  onYearInputChange: (val: string) => void
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  showYearChevrons?: boolean
  onNow?: () => void
  onDone?: () => void
}

export function MonthGrid({
  year,
  yearInput,
  month,
  onYearInputChange,
  onYearChange,
  onMonthChange,
  showYearChevrons = false,
  onNow,
  onDone,
}: MonthGridProps) {
  const { t } = useTranslation()
  const MONTH_NAMES = getMonthNames()

  const handleYearInput = (val: string) => {
    const normalized = val.replace(/[٠-٩]/g, (d) =>
      String(d.charCodeAt(0) - 0x0660),
    )
    const digits = normalized.replace(/\D/g, "").slice(0, 4)
    onYearInputChange(digits)

    const num = parseInt(digits, 10)
    if (!Number.isNaN(num)) {
      onYearChange(clampYear(num))
    }
  }

  const handleYearDecrement = () => {
    onYearChange(clampYear(year - 1))
  }

  const handleYearIncrement = () => {
    onYearChange(clampYear(year + 1))
  }

  return (
    <View style={styles.container}>
      <View style={styles.yearRow}>
        {showYearChevrons && (
          <Button
            variant="secondary"
            size="icon"
            hitSlop={8}
            onPress={handleYearDecrement}
          >
            <ChevronIcon direction="leading" size={24} />
          </Button>
        )}

        <Input
          value={yearInput}
          onChangeText={handleYearInput}
          keyboardType="number-pad"
          maxLength={4}
          placeholder={t("components.dateRange.yearInputPlaceholder")}
          style={styles.yearInput}
          textAlign="center"
        />

        {showYearChevrons && (
          <Button
            variant="secondary"
            size="icon"
            hitSlop={8}
            onPress={handleYearIncrement}
          >
            <ChevronIcon direction="trailing" size={24} />
          </Button>
        )}
      </View>

      <View style={styles.monthGrid}>
        {MONTH_NAMES.map((name, idx) => {
          const isSelected = month === idx

          return (
            <Pressable
              key={name}
              onPress={() => onMonthChange(idx)}
              style={[styles.monthCell, isSelected && styles.monthCellSelected]}
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

      {(onNow || onDone) && (
        <View style={styles.actionsRow}>
          {onNow && (
            <Button variant="secondary" onPress={onNow}>
              <Text>{t("components.dateRange.now")}</Text>
            </Button>
          )}
          {onDone && (
            <Button variant="secondary" onPress={onDone}>
              <Text>{t("common.actions.done")}</Text>
            </Button>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => {
  const primary = theme.colors.primary

  return {
    container: {
      gap: 16,
    },

    yearRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
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
