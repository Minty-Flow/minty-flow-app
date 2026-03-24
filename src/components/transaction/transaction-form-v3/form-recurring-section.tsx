import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { RecurringEndType, RecurringFrequency } from "~/types/transactions"
import { formatCreatedAt } from "~/utils/time-utils"

import { ENDS_ON_OCCURRENCE_PRESETS, RECURRING_OPTIONS } from "./constants"
import { transactionFormStyles } from "./form.styles"
import { getRecurrenceDisplayLabel } from "./form-utils"

type Props = {
  enabled: boolean
  frequency: RecurringFrequency
  startDate: Date
  endDate: Date | null
  endAfterOccurrences: number | null
  endsOnPickerExpanded: boolean
  endsOnType: RecurringEndType
  recurringEndDateOccurrenceCount: number | null
  onToggle: (next: boolean) => void
  onFrequencyChange: (f: RecurringFrequency) => void
  onStartDatePress: () => void
  onEndPickerToggle: () => void
  onEndTypeNever: () => void
  onEndTypeDate: () => void
  onEndTypeOccurrences: () => void
  onOccurrencePreset: (n: number) => void
}

export function FormRecurringSection({
  enabled,
  frequency,
  startDate,
  endDate,
  endAfterOccurrences,
  endsOnPickerExpanded,
  endsOnType,
  recurringEndDateOccurrenceCount,
  onToggle,
  onFrequencyChange,
  onStartDatePress,
  onEndPickerToggle,
  onEndTypeNever,
  onEndTypeDate,
  onEndTypeOccurrences,
  onOccurrencePreset,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const endsOnLabel =
    endsOnType === "never"
      ? t("components.transactionForm.recurring.never")
      : endsOnType === "date" && endDate
        ? `${formatCreatedAt(endDate)}${recurringEndDateOccurrenceCount != null ? ` · ${t("components.transactionForm.recurring.timesCount", { count: recurringEndDateOccurrenceCount })}` : ""}`
        : endsOnType === "occurrences" && endAfterOccurrences !== null
          ? t("components.transactionForm.recurring.timesCount", {
              count: endAfterOccurrences,
            })
          : t("components.transactionForm.recurring.never")

  return (
    <View style={transactionFormStyles.fieldBlock}>
      {/* Recurring toggle row */}
      <Pressable
        style={transactionFormStyles.recurringSwitchRow}
        onPress={() => onToggle(!enabled)}
      >
        <View style={transactionFormStyles.switchLeft}>
          <DynamicIcon
            icon="repeat"
            size={20}
            color={theme.colors.primary}
            variant="badge"
          />
          <Text variant="default" style={transactionFormStyles.switchLabel}>
            {t("components.transactionForm.recurring.label")}
          </Text>
        </View>
        <Switch value={enabled} onValueChange={onToggle} />
      </Pressable>

      {enabled && (
        <View>
          {/* Recurrence frequency */}
          <View style={transactionFormStyles.recurringSubSection}>
            <Text
              variant="small"
              style={transactionFormStyles.recurringSubLabel}
            >
              {t("components.transactionForm.recurring.recurrence")}
            </Text>
            <View style={transactionFormStyles.recurringToggleRow}>
              {RECURRING_OPTIONS.map((option) => {
                const isSelected = frequency === option.id
                const displayLabel = getRecurrenceDisplayLabel(
                  option.id,
                  startDate,
                )
                return (
                  <Pressable
                    key={option.label}
                    style={[
                      transactionFormStyles.recurringToggleButton,
                      isSelected &&
                        transactionFormStyles.recurringToggleButtonSelected,
                    ]}
                    onPress={() => onFrequencyChange(option.id)}
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${displayLabel}${isSelected ? t("components.transactionForm.a11y.selectedSuffix") : ""}`}
                  >
                    <Text
                      variant="default"
                      style={[
                        transactionFormStyles.recurringToggleLabel,
                        isSelected &&
                          transactionFormStyles.recurringToggleLabelSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {displayLabel}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          {/* Starts on */}
          <View style={transactionFormStyles.recurringSubSection}>
            <Text
              variant="small"
              style={transactionFormStyles.recurringSubLabel}
            >
              {t("components.transactionForm.recurring.startsOn")}
            </Text>
            <Pressable
              style={transactionFormStyles.recurringDateRow}
              onPress={onStartDatePress}
            >
              <DynamicIcon
                icon="calendar"
                size={20}
                color={theme.colors.primary}
                variant="badge"
              />
              <Text
                variant="default"
                style={transactionFormStyles.inlineDateText}
              >
                {formatCreatedAt(startDate)}
              </Text>
              <ChevronIcon
                direction="trailing"
                size={20}
                style={transactionFormStyles.chevronIcon}
              />
            </Pressable>
          </View>

          {/* Ends on */}
          <View style={transactionFormStyles.recurringSubSection}>
            <Text
              variant="small"
              style={transactionFormStyles.recurringSubLabel}
            >
              {t("components.transactionForm.recurring.endsOn")}
            </Text>
            <Pressable
              style={transactionFormStyles.recurringDateRow}
              onPress={onEndPickerToggle}
            >
              <DynamicIcon
                icon="calendar"
                size={20}
                color={theme.colors.primary}
                variant="badge"
              />
              <Text
                variant="default"
                style={[
                  transactionFormStyles.inlineDateText,
                  endsOnType === "never" &&
                    transactionFormStyles.fieldPlaceholder,
                ]}
              >
                {endsOnLabel}
              </Text>
              <ChevronIcon
                direction={endsOnPickerExpanded ? "up" : "trailing"}
                size={20}
                style={transactionFormStyles.chevronIcon}
              />
            </Pressable>

            {endsOnPickerExpanded && (
              <View style={transactionFormStyles.endsOnPickerContainer}>
                <Pressable
                  style={transactionFormStyles.endsOnOptionRow}
                  onPress={onEndTypeNever}
                >
                  <Text
                    variant="default"
                    style={transactionFormStyles.endsOnOptionLabel}
                  >
                    {t("components.transactionForm.recurring.never")}
                  </Text>
                  <ChevronIcon
                    direction="trailing"
                    size={20}
                    style={transactionFormStyles.chevronIcon}
                  />
                </Pressable>
                <Pressable
                  style={transactionFormStyles.endsOnOptionRow}
                  onPress={onEndTypeDate}
                >
                  <Text
                    variant="default"
                    style={transactionFormStyles.endsOnOptionLabel}
                  >
                    {t("components.transactionForm.recurring.onADate")}
                  </Text>
                  <ChevronIcon
                    direction="trailing"
                    size={20}
                    style={transactionFormStyles.chevronIcon}
                  />
                </Pressable>
                <Pressable
                  style={[
                    transactionFormStyles.endsOnOptionRow,
                    transactionFormStyles.endsOnOptionRowLast,
                  ]}
                  onPress={onEndTypeOccurrences}
                >
                  <Text
                    variant="default"
                    style={transactionFormStyles.endsOnOptionLabel}
                  >
                    {t("components.transactionForm.recurring.occurrences")}
                  </Text>
                  <ChevronIcon
                    direction="trailing"
                    size={20}
                    style={transactionFormStyles.chevronIcon}
                  />
                </Pressable>
                {endAfterOccurrences !== null && (
                  <View style={transactionFormStyles.occurrencePresetsRow}>
                    {ENDS_ON_OCCURRENCE_PRESETS.map((n) => (
                      <Pressable
                        key={n}
                        style={[
                          transactionFormStyles.occurrencePresetButton,
                          endAfterOccurrences === n &&
                            transactionFormStyles.recurringToggleButtonSelected,
                        ]}
                        onPress={() => onOccurrencePreset(n)}
                      >
                        <Text
                          variant="default"
                          style={[
                            transactionFormStyles.recurringToggleLabel,
                            endAfterOccurrences === n &&
                              transactionFormStyles.recurringToggleLabelSelected,
                          ]}
                        >
                          {t(
                            "components.transactionForm.recurring.timesCount",
                            { count: n },
                          )}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}
