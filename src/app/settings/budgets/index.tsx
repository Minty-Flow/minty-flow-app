import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { BudgetCard } from "~/components/budgets/budget-card"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"
import { observeBudgets } from "~/database/services/budget-service"
import type { Budget } from "~/types/budgets"
import { NewEnum } from "~/types/new"

// ---------------------------------------------------------------------------
// Observed list component — re-renders reactively when budgets change
// ---------------------------------------------------------------------------

interface BudgetListContentInnerProps {
  budgets: Budget[]
}

function BudgetListContentInner({ budgets }: BudgetListContentInnerProps) {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
  const router = useRouter()

  const handleAddBudget = useCallback(() => {
    router.push(`/settings/budgets/${NewEnum.NEW}/modify`)
  }, [router])

  const handleEditBudget = useCallback(
    (budgetId: string) => {
      router.push(`/settings/budgets/${budgetId}`)
    },
    [router],
  )

  const renderBudgetItem = useCallback(
    ({ item }: { item: Budget }) => (
      <BudgetCard budget={item} onPress={() => handleEditBudget(item.id)} />
    ),
    [handleEditBudget],
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="chart-pie"
            title={t("screens.settings.budgets.empty")}
          />
        }
        renderItem={renderBudgetItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Pressable
        onPress={handleAddBudget}
        style={styles.fab}
        accessibilityLabel={t("screens.settings.budgets.addNew")}
      >
        <IconSvg name="plus" size={24} color={theme.colors.onPrimary} />
      </Pressable>
    </View>
  )
}

// Wrap with WatermelonDB reactive observer — budgets update automatically
const BudgetListContent = withObservables([], () => ({
  budgets: observeBudgets(),
}))(BudgetListContentInner)

export default function BudgetsScreen() {
  return <BudgetListContent />
}

const styles = StyleSheet.create((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.surface,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
  },
  separator: {
    height: 0,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: t.radius,
    backgroundColor: t.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: t.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
}))
