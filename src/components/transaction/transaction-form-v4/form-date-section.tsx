import type { Control } from "react-hook-form"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { InfoBanner } from "~/components/ui/info-banner"
import { ListItem } from "~/components/ui/list-item"
import { Switch } from "~/components/ui/switch"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { startOfNextMinute } from "~/utils/pending-transactions"
import { formatTransactionDateTime } from "~/utils/time-utils"

import { transactionFormStyles } from "./form.styles"

type Props = {
  date: Date
  control: Control<TransactionFormValues>
  onDatePress: () => void
}

export function FormDateSection({ date, control, onDatePress }: Props) {
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
        <Text variant="small" style={transactionFormStyles.sectionLabel}>
          {t("components.transactionForm.fields.transactionDate")}
        </Text>
        <ListItem
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
            {formatTransactionDateTime(date)}
          </Text>
          <ChevronIcon
            direction="trailing"
            size={20}
            style={transactionFormStyles.chevronIcon}
          />
        </ListItem>
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
