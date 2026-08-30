import { useTranslation } from "react-i18next"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Budget } from "~/types/budgets"

import { transactionFormStyles } from "./form.styles"

type Props = {
  budgets: Budget[]
  budgetId: string | null | undefined
  onSelect: (id: string) => void
  onClear: () => void
}

export function FormBudgetPicker({
  budgets,
  budgetId,
  onSelect,
  onClear,
}: Props) {
  const { t } = useTranslation()

  if (budgets.length === 0) {
    return null
  }

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.budget")}
        </Text>
        <Pressable
          onPress={() => budgetId && onClear()}
          style={[
            transactionFormStyles.clearButton,
            !budgetId && transactionFormStyles.clearButtonDisabled,
          ]}
          pointerEvents={budgetId ? "auto" : "none"}
          accessibilityLabel={t("components.transactionForm.a11y.clearBudget")}
          accessibilityState={{ disabled: !budgetId }}
        >
          <Text variant="small" style={transactionFormStyles.clearButtonText}>
            {t("components.transactionForm.fields.clear")}
          </Text>
        </Pressable>
      </View>
      <View style={transactionFormStyles.tagsWrapGrid}>
        {budgets.map((budget) => {
          const isSelected = budget.id === budgetId
          return (
            <Chip
              key={budget.id}
              label={budget.name}
              selected={isSelected}
              onPress={() => (isSelected ? onClear() : onSelect(budget.id))}
              leading={
                <DynamicIcon
                  icon={budget.icon || "chart-pie-outline"}
                  size={16}
                  colorScheme={getThemeStrict(budget.colorSchemeName)}
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
