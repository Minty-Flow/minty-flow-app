import { useTranslation } from "react-i18next"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Loan } from "~/types/loans"

import { transactionFormStyles } from "./form.styles"

type Props = {
  loans: Loan[]
  loanId: string | null | undefined
  onSelect: (id: string) => void
  onClear: () => void
}

export function FormLoanPicker({ loans, loanId, onSelect, onClear }: Props) {
  const { t } = useTranslation()

  if (loans.length === 0) {
    return null
  }

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.loan")}
        </Text>
        <Pressable
          onPress={() => loanId && onClear()}
          style={[
            transactionFormStyles.clearButton,
            !loanId && transactionFormStyles.clearButtonDisabled,
          ]}
          pointerEvents={loanId ? "auto" : "none"}
          accessibilityLabel={t("components.transactionForm.a11y.clearLoan")}
          accessibilityState={{ disabled: !loanId }}
        >
          <Text variant="small" style={transactionFormStyles.clearButtonText}>
            {t("components.transactionForm.fields.clear")}
          </Text>
        </Pressable>
      </View>
      <View style={transactionFormStyles.tagsWrapGrid}>
        {loans.map((loan) => {
          const isSelected = loan.id === loanId
          return (
            <Chip
              key={loan.id}
              label={loan.name}
              selected={isSelected}
              onPress={() => (isSelected ? onClear() : onSelect(loan.id))}
              leading={
                <DynamicIcon
                  icon={loan.icon || "banknotes"}
                  size={16}
                  colorScheme={getThemeStrict(loan.colorSchemeName)}
                  variant="badge"
                />
              }
            />
          )
        })}
      </View>
    </View>
  )
}
