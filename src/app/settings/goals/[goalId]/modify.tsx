import { useLocalSearchParams } from "expo-router"

import { GoalModifyContent } from "~/components/goals/goal-modify/goal-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useGoalsQuery } from "~/database/drizzle/hooks/use-goals-query"
import { useActiveAccounts } from "~/stores/db/account.store"
import { NewEnum } from "~/types/new"

export default function GoalModifyScreen() {
  const params = useLocalSearchParams<{ goalId: string }>()
  const goalId = params.goalId ?? NewEnum.NEW
  const isAddMode = goalId === NewEnum.NEW || !goalId

  const goalsQuery = useGoalsQuery()
  const goal = goalsQuery.data.find((item) => item.id === goalId)
  const accounts = useActiveAccounts()

  if (isAddMode) {
    return <GoalModifyContent goalModifyId={NewEnum.NEW} accounts={accounts} />
  }

  if (goalsQuery.updatedAt === undefined) return <RouteLoadingState />
  if (!goal) return <RouteNotFoundState message="Goal not found." />

  return (
    <GoalModifyContent
      key={goalId}
      goalModifyId={goalId}
      goal={goal}
      accounts={accounts}
    />
  )
}
