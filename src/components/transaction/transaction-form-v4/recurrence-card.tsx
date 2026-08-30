import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Recurrence, RecurrenceUnit } from "~/types/transactions"
import { clampInterval } from "~/utils/recurrence"
import { formatTransactionDateTime } from "~/utils/time-utils"

import { transactionFormStyles } from "./form.styles"
import { RecurrenceUnitModal } from "./recurrence-unit-modal"

type Props = {
  recurrence: Recurrence
  until: Date | null
  occurrenceCount: number | null
  onIntervalChange: (n: number) => void
  onUnitChange: (u: RecurrenceUnit) => void
  onUntilPress: () => void
  onUntilReset: () => void
}

export function RecurrenceCard({
  recurrence,
  until,
  occurrenceCount,
  onIntervalChange,
  onUnitChange,
  onUntilPress,
  onUntilReset,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [unitModal, setUnitModal] = useState(false)

  const unitLabel = t(
    `components.transactionForm.recurrence.unit.${recurrence.unit}`,
    { count: recurrence.interval },
  )
  const untilLabel = until
    ? `${formatTransactionDateTime(until)}${
        occurrenceCount != null ? `  ·  ×${occurrenceCount}` : ""
      }`
    : t("components.transactionForm.recurrence.forever")

  return (
    <View style={transactionFormStyles.fieldBlock}>
      {/* "Repeat every  [−] N [+]  [unit ▾]" */}
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.recurrence.every")}
        </Text>
      </View>
      <View style={transactionFormStyles.recurrenceRow}>
        <Pressable
          onPress={() =>
            onIntervalChange(clampInterval(recurrence.interval - 1))
          }
          disabled={recurrence.interval <= 1}
          accessibilityLabel={t(
            "components.transactionForm.recurrence.decrement",
          )}
          style={transactionFormStyles.stepperButton}
        >
          <Text variant="large">−</Text>
        </Pressable>
        <Text variant="large" style={transactionFormStyles.stepperValue}>
          {recurrence.interval}
        </Text>
        <Pressable
          onPress={() =>
            onIntervalChange(clampInterval(recurrence.interval + 1))
          }
          disabled={recurrence.interval >= 999}
          accessibilityLabel={t(
            "components.transactionForm.recurrence.increment",
          )}
          style={transactionFormStyles.stepperButton}
        >
          <Text variant="large">+</Text>
        </Pressable>

        <Pressable
          onPress={() => setUnitModal(true)}
          style={transactionFormStyles.recurrenceUnitButton}
          accessibilityRole="button"
        >
          <Text variant="default">{unitLabel}</Text>
          <ChevronIcon
            direction="trailing"
            size={20}
            style={transactionFormStyles.chevronIcon}
          />
        </Pressable>
      </View>

      {/* "Until  <Forever | date · ×N>  [Reset]" */}
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.recurrence.until")}
        </Text>
        {until && (
          <Pressable
            onPress={onUntilReset}
            style={transactionFormStyles.clearButton}
            accessibilityLabel={t(
              "components.transactionForm.recurrence.reset",
            )}
          >
            <Text variant="small" style={transactionFormStyles.clearButtonText}>
              {t("components.transactionForm.recurrence.reset")}
            </Text>
          </Pressable>
        )}
      </View>
      <ListItem
        style={transactionFormStyles.inlineDateRow}
        onPress={onUntilPress}
      >
        <DynamicIcon
          icon="calendar-outline"
          size={20}
          color={theme.colors.primary}
          variant="badge"
        />
        <Text
          variant="default"
          style={[
            transactionFormStyles.recurrenceUntilText,
            !until && transactionFormStyles.fieldPlaceholder,
          ]}
        >
          {untilLabel}
        </Text>
        <ChevronIcon
          direction="trailing"
          size={20}
          style={transactionFormStyles.chevronIcon}
        />
      </ListItem>

      {occurrenceCount === 0 && (
        <Text variant="small" style={transactionFormStyles.fieldError}>
          {t("components.transactionForm.recurrence.untilBeforeStart")}
        </Text>
      )}

      <RecurrenceUnitModal
        visible={unitModal}
        value={recurrence.unit}
        onSelect={onUnitChange}
        onClose={() => setUnitModal(false)}
      />
    </View>
  )
}
