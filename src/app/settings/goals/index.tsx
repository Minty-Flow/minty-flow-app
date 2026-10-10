import { useNavigation, useRouter } from "expo-router"
import { useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { GoalCard } from "~/components/goals/goal-card"
import { IconSvg } from "~/components/icons"
import { RouteLoadingState } from "~/components/route-load-state"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { Fab } from "~/components/ui/fab"
import { View } from "~/components/ui/view"
import { useAllGoalsQuery } from "~/database/drizzle/read-models/goal-read-model"
import type { Goal } from "~/types/goals"
import { NewEnum } from "~/types/new"
export default function GoalsScreen() {
  const { data: goals, status } = useAllGoalsQuery()
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
          <IconSvg name="archive-outline" size={20} />
        </Button>
      ),
    })
  }, [navigation, router, t])
  const handleAddGoal = () => {
    router.push(`/settings/goals/${NewEnum.NEW}/modify`)
  }
  const handleGoalPress = (goalId: string) => {
    router.push(`/settings/goals/${goalId}`)
  }
  const renderGoalItem = ({ item }: { item: Goal }) => (
    <GoalCard goal={item} onPress={() => handleGoalPress(item.id)} />
  )
  if (status === "loading") return <RouteLoadingState />
  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="target-outline"
            title={t("screens.settings.goals.empty")}
          />
        }
        renderItem={renderGoalItem}
      />
      <Fab
        onPress={handleAddGoal}
        accessibilityLabel={t("screens.settings.goals.addNew")}
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
    padding: 20,
    paddingBottom: 96,
    gap: 12,
  },
}))
