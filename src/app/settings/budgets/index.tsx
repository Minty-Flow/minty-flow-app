import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { BudgetCard } from "~/components/budgets/budget-card"
import { RouteLoadingState } from "~/components/route-load-state"
import { EmptyState } from "~/components/ui/empty-state"
import { Fab } from "~/components/ui/fab"
import { View } from "~/components/ui/view"
import { useBudgetsQuery } from "~/database/drizzle/read-models/budget-read-model"
import { useCategories } from "~/database/drizzle/read-models/category-read-model"
import type { Budget } from "~/types/budgets"
import { NewEnum } from "~/types/new"
export default function BudgetsScreen() {
  const { data: budgets, status } = useBudgetsQuery()
  const categories = useCategories()
  const { t } = useTranslation()
  const router = useRouter()
  const handleAddBudget = () => {
    router.push(`/settings/budgets/${NewEnum.NEW}/modify`)
  }
  const handleEditBudget = (budgetId: string) => {
    router.push(`/settings/budgets/${budgetId}`)
  }
  const renderBudgetItem = ({ item }: { item: Budget }) => (
    <BudgetCard
      budget={item}
      categories={categories}
      onPress={() => handleEditBudget(item.id)}
    />
  )
  if (status === "loading") return <RouteLoadingState />
  return (
    <View style={styles.container}>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="chart-pie-outline"
            title={t("screens.settings.budgets.empty")}
          />
        }
        renderItem={renderBudgetItem}
      />
      <Fab
        onPress={handleAddBudget}
        accessibilityLabel={t("screens.settings.budgets.addNew")}
      />
    </View>
  )
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
}))
