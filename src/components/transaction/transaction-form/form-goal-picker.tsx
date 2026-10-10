import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { Goal } from "~/types/goals"

import { transactionFormStyles } from "./form.styles"

type Props = {
  goals: Goal[]
  goalId: string | null | undefined
  onSelect: (id: string) => void
  onClear: () => void
}

export function FormGoalPicker({ goals, goalId, onSelect, onClear }: Props) {
  if (goals.length === 0) {
    return null
  }

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.tagsWrapGrid}>
        {goals.map((goal) => {
          const isSelected = goal.id === goalId
          return (
            <Chip
              key={goal.id}
              label={goal.name}
              selected={isSelected}
              onPress={() => (isSelected ? onClear() : onSelect(goal.id))}
              leading={
                <DynamicIcon
                  icon={goal.icon || "target-outline"}
                  size={16}
                  colorScheme={getThemeStrict(goal.colorSchemeName)}
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
