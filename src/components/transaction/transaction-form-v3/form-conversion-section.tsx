import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Money } from "~/components/money"
import { SmartAmountInput } from "~/components/smart-amount-input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { Account } from "~/types/accounts"

import { transactionFormStyles } from "./form.styles"

type Props = {
  amount: number
  conversionRate: number | null
  onConversionRateChange: (rate: number) => void
  selectedAccount: Account
  selectedToAccount: Account
}

export function FormConversionSection({
  amount,
  conversionRate,
  onConversionRateChange,
  selectedAccount,
  selectedToAccount,
}: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const amountNum =
    typeof amount === "number"
      ? amount
      : Number.parseFloat(String(amount ?? "")) || 0
  const convertedAmount = (conversionRate ?? 0) * amountNum

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.conversion")}
        </Text>
      </View>

      {/* Toggle row: amount = converted amount */}
      <Pressable
        style={[
          transactionFormStyles.conversionRateRow,
          open && transactionFormStyles.conversionRateRowSelected,
        ]}
        onPress={() => setOpen((o) => !o)}
      >
        <Money
          value={amountNum}
          currency={selectedAccount.currencyCode}
          style={transactionFormStyles.conversionRateAmount}
        />
        <Text style={transactionFormStyles.conversionRateEquals}>=</Text>
        <Money
          value={convertedAmount}
          currency={selectedToAccount.currencyCode}
          style={transactionFormStyles.conversionRateAmount}
        />
      </Pressable>

      {open && (
        <>
          {/* Rate summary row */}
          <View style={transactionFormStyles.conversionRateSummaryRow}>
            <Text style={transactionFormStyles.conversionRateSummaryLabel}>
              {t("components.transactionForm.fields.conversionRate")}
            </Text>
            <View style={transactionFormStyles.conversionRateSummaryValues}>
              <Money
                value={1}
                currency={selectedAccount.currencyCode}
                style={transactionFormStyles.conversionRateAmount}
              />
              <Text style={transactionFormStyles.conversionRateEquals}>=</Text>
              <Text style={transactionFormStyles.conversionOutcomeRate}>
                {(conversionRate ?? 0).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}{" "}
                {selectedToAccount.currencyCode}
              </Text>
            </View>
          </View>

          {/* Formula row: amount × rate = converted */}
          <View style={transactionFormStyles.conversionOutcomeRow}>
            <View style={transactionFormStyles.conversionOutcomeLeft}>
              <Money
                value={amountNum}
                currency={selectedAccount.currencyCode}
                style={transactionFormStyles.conversionOutcomeAmount}
              />
            </View>
            <Text style={transactionFormStyles.conversionRateEquals}>×</Text>
            <Text style={transactionFormStyles.conversionOutcomeRate}>
              {(conversionRate ?? 0).toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}
            </Text>
            <Text style={transactionFormStyles.conversionRateEquals}>=</Text>
            <Money
              value={convertedAmount}
              currency={selectedToAccount.currencyCode}
              style={transactionFormStyles.conversionOutcomeAmount}
            />
          </View>

          {/* SmartAmountInput to change the converted amount (deduces rate on change) */}
          <View style={transactionFormStyles.conversionInputRow}>
            <SmartAmountInput
              value={convertedAmount}
              onChange={(value) => {
                if (amountNum > 0 && typeof value === "number") {
                  onConversionRateChange(value / amountNum)
                }
              }}
              currencyCode={selectedToAccount.currencyCode}
              label={t(
                "components.transactionForm.fields.convertedAmountLabel",
              )}
              placeholder="0"
            />
          </View>
        </>
      )}
    </View>
  )
}
