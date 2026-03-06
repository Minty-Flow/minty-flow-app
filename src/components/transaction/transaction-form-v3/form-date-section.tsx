import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSymbol } from "~/components/ui/icon-symbol"
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
            icon="calendar"
            size={20}
            color={theme.colors.primary}
            variant="badge"
          />
          <Text variant="default" style={transactionFormStyles.inlineDateText}>
            {formatCreatedAt(date)}
          </Text>
          <IconSymbol
            name="chevron-right"
            size={20}
            style={[
              transactionFormStyles.chevronIcon,
              { color: theme.colors.primary },
            ]}
          />
        </Pressable>
      </View>

      <Controller
        control={control}
        name="isPending"
        render={({ field: { value, onChange } }) => {
          const txDate = date
          const isFuture =
            txDate && txDate.getTime() > startOfNextMinute().getTime()
          return (
            <Pressable
              style={transactionFormStyles.switchRow}
              onPress={() => !isFuture && onChange(!(value ?? false))}
              accessibilityRole="switch"
              accessibilityState={{
                checked: value ?? false,
                disabled: !!isFuture,
              }}
            >
              <View style={transactionFormStyles.switchLeft}>
                <DynamicIcon
                  icon="clock"
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
              <View pointerEvents="none">
                <Switch
                  value={value ?? false}
                  onValueChange={onChange}
                  disabled={!!isFuture}
                />
              </View>
            </Pressable>
          )
        }}
      />
    </>
  )
}
