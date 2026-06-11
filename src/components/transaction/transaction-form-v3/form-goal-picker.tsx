import { useTranslation } from "react-i18next"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Chip } from "~/components/ui/chips"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
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
  const { t } = useTranslation()

  if (goals.length === 0) {
    return null
  }

  return (
    <View style={transactionFormStyles.fieldBlock}>
      <View style={transactionFormStyles.sectionLabelRow}>
        <Text variant="small" style={transactionFormStyles.sectionLabelInRow}>
          {t("components.transactionForm.fields.goal")}
        </Text>
        <Pressable
          onPress={() => goalId && onClear()}
          style={[
            transactionFormStyles.clearButton,
            !goalId && transactionFormStyles.clearButtonDisabled,
          ]}
          pointerEvents={goalId ? "auto" : "none"}
          accessibilityLabel={t("components.transactionForm.a11y.clearGoal")}
          accessibilityState={{ disabled: !goalId }}
        >
          <Text variant="small" style={transactionFormStyles.clearButtonText}>
            {t("components.transactionForm.fields.clear")}
          </Text>
        </Pressable>
      </View>
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
