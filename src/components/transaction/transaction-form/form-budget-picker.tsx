import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
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
  if (budgets.length === 0) {
    return null
  }

  return (
    <View style={transactionFormStyles.fieldBlock}>
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
