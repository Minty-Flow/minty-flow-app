import type { Control } from "react-hook-form"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { InfoBanner } from "~/components/ui/info-banner"
import { Pressable } from "~/components/ui/pressable"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { startOfNextMinute } from "~/utils/pending-transactions"
import { formatCreatedAt } from "~/utils/time-utils"

import { transactionFormStyles } from "./form.styles"

type Props = {
  date: Date
  control: Control<TransactionFormValues>
  onDatePress: () => void
  onSetNow: () => void
}

export function FormDateSection({
  date,
  control,
  onDatePress,
  onSetNow,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  // Pending only makes sense for a future date, or when editing a tx that is
  // already pending (e.g. an overdue one) so the user can still turn it off.
  const isPending = useWatch({ control, name: "isPending" })
  const isFuture = date.getTime() > startOfNextMinute().getTime()
  const showPending = isFuture || !!isPending

  return (
    <>
      <View style={transactionFormStyles.fieldBlock}>
        <View style={transactionFormStyles.sectionLabelRow}>
          <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
            {t("components.transactionForm.fields.transactionDate")}
          </Text>
          <Pressable
            onPress={onSetNow}
            style={transactionFormStyles.clearButton}
            accessibilityLabel={t(
              "components.transactionForm.a11y.setDateTimeNow",
            )}
          >
            <Text variant="small" style={transactionFormStyles.clearButtonText}>
              {t("components.transactionForm.fields.now")}
            </Text>
          </Pressable>
        </View>
        <Pressable
          style={transactionFormStyles.inlineDateRow}
          onPress={onDatePress}
        >
          <DynamicIcon
            icon="calendar-outline"
            size={20}
            color={theme.colors.primary}
            variant="badge"
          />
          <Text variant="default" style={transactionFormStyles.inlineDateText}>
            {formatCreatedAt(date)}
          </Text>
          <ChevronIcon
            direction="trailing"
            size={20}
            style={transactionFormStyles.chevronIcon}
          />
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
                <Pressable
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
                </Pressable>
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
