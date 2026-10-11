import type { Control } from "react-hook-form"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { InfoBanner } from "~/components/ui/info-banner"
import { ListItem } from "~/components/ui/list-item"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { startOfNextMinute } from "~/utils/pending-transactions"
import { formatTimeParts, formatTransactionDay } from "~/utils/time-utils"

import { transactionFormStyles } from "./form.styles"

type Props = {
  date: Date
  control: Control<TransactionFormValues>
  onDatePress: () => void
  onTimePress: () => void
  /** Loan kinds: this row is the loan's due date, and pending never applies. */
  dueDateMode?: boolean
}

export function FormDateSection({
  date,
  control,
  onDatePress,
  onTimePress,
  dueDateMode = false,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  // Pending only makes sense for a future date, or when editing a tx that is
  // already pending (e.g. an overdue one) so the user can still turn it off.
  const isPending = useWatch({ control, name: "isPending" })
  const isFuture = date.getTime() > startOfNextMinute().getTime()
  const showPending = !dueDateMode && (isFuture || !!isPending)
  const time = formatTimeParts(date)

  return (
    <>
      {/* Date button (left) and time button (right): each opens only its own picker. */}
      <View style={transactionFormStyles.dateTimeRow}>
        <Pressable
          style={transactionFormStyles.dateButton}
          onPress={onDatePress}
          accessibilityRole="button"
        >
          <DynamicIcon
            icon="calendar-month"
            size={22}
            color={theme.colors.primary}
            variant="badge"
          />
          <Text
            variant="default"
            numberOfLines={1}
            style={transactionFormStyles.dateButtonText}
          >
            {formatTransactionDay(date)}
          </Text>
        </Pressable>

        <Pressable
          style={transactionFormStyles.timeButton}
          onPress={onTimePress}
          accessibilityRole="button"
        >
          <View style={transactionFormStyles.timeBox}>
            <Text style={transactionFormStyles.timeText}>{time.hour}</Text>
          </View>
          <Text style={transactionFormStyles.timeColon}>:</Text>
          <View style={transactionFormStyles.timeBox}>
            <Text style={transactionFormStyles.timeText}>{time.minute}</Text>
          </View>
          {time.period ? (
            <View style={transactionFormStyles.timeBox}>
              <Text style={transactionFormStyles.timePeriodText}>
                {time.period}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {showPending && (
        <Controller
          control={control}
          name="isPending"
          render={({ field: { value, onChange } }) => {
            const checked = value ?? false
            return (
              <>
                <ListItem
                  style={transactionFormStyles.pendingSwitchRow}
                  onPress={() => onChange(!checked)}
                  accessibilityRole="switch"
                  accessibilityState={{ checked }}
                >
                  <View style={transactionFormStyles.switchLeft}>
                    <DynamicIcon
                      icon="history-toggle-outline"
                      size={20}
                      color={theme.colors.primary}
                      variant="badge"
                    />
                    <Text
                      variant="default"
                      style={transactionFormStyles.switchLabel}
                    >
                      {t("components.transactionForm.fields.pending")}
                    </Text>
                  </View>
                  <Switch value={checked} onValueChange={onChange} />
                </ListItem>
                <View style={{ marginTop: -8, paddingBottom: 16 }}>
                  <InfoBanner
                    text={
                      checked
                        ? t("components.transactionForm.fields.pendingHintOn")
                        : t("components.transactionForm.fields.pendingHintOff")
                    }
                  />
                </View>
              </>
            )
          }}
        />
      )}
    </>
  )
}
