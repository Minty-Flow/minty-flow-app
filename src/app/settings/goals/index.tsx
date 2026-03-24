import { withObservables } from "@nozbe/watermelondb/react"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { GoalCard } from "~/components/goals/goal-card"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"
import { observeGoals } from "~/database/services/goal-service"
import type { Goal } from "~/types/goals"
import { NewEnum } from "~/types/new"

interface GoalsListContentProps {
  goals: Goal[]
}

function GoalsListContent({ goals }: GoalsListContentProps) {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.push("/settings/goals/archived")}
          accessibilityLabel={t("screens.settings.goals.archivedButton")}
        >
          <IconSvg name="archive" size={20} />
        </Button>
      ),
    })
  }, [navigation, router, t])

  const handleAddGoal = useCallback(() => {
    router.push(`/settings/goals/${NewEnum.NEW}/modify`)
  }, [router])

  const handleGoalPress = useCallback(
    (goalId: string) => {
      router.push(`/settings/goals/${goalId}`)
    },
    [router],
  )

  const renderGoalItem = useCallback(
    ({ item }: { item: Goal }) => (
      <GoalCard goal={item} onPress={() => handleGoalPress(item.id)} />
    ),
    [handleGoalPress],
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState icon="target" title={t("screens.settings.goals.empty")} />
        }
        renderItem={renderGoalItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Pressable
        onPress={handleAddGoal}
        style={styles.fab}
        accessibilityLabel={t("screens.settings.goals.addNew")}
      >
        <IconSvg name="plus" size={24} color={theme.colors.onPrimary} />
      </Pressable>
    </View>
  )
}

const EnhancedGoalsList = withObservables([], () => ({
  goals: observeGoals(),
}))(GoalsListContent)

export default function GoalsScreen() {
  return <EnhancedGoalsList />
}

const styles = StyleSheet.create((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.surface,
  },
  listContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
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
