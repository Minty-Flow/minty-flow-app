import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { GoalCard } from "~/components/goals/goal-card"
import { EmptyState } from "~/components/ui/empty-state"
import { View } from "~/components/ui/view"
import { observeArchivedGoals } from "~/database/services/goal-service"
import type { Goal } from "~/types/goals"

interface ArchivedGoalsContentProps {
  goals: Goal[]
}

function ArchivedGoalsContent({ goals }: ArchivedGoalsContentProps) {
  const { t } = useTranslation()
  const router = useRouter()

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
          <EmptyState
            icon="archive"
            title={t("screens.settings.goals.archived.empty")}
          />
        }
        renderItem={renderGoalItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const EnhancedArchivedGoals = withObservables([], () => ({
  goals: observeArchivedGoals(),
}))(ArchivedGoalsContent)

export default function ArchivedGoalsScreen() {
  return <EnhancedArchivedGoals />
}

const styles = StyleSheet.create((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.surface,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  separator: {
    height: 0,
  },
}))
