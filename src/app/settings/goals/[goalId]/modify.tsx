import { useLocalSearchParams } from "expo-router"

import { GoalModifyContent } from "~/components/goals/goal-modify/goal-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useGoalsQuery } from "~/database/drizzle/read-models/goal-read-model"
import { useModifyRouteLoader } from "~/hooks/use-modify-route-loader"
import { NewEnum } from "~/types/new"

export default function GoalModifyScreen() {
  const params = useLocalSearchParams<{ goalId: string }>()
  const goalId = params.goalId ?? NewEnum.NEW

  const goalsQuery = useGoalsQuery()
  const loadState = useModifyRouteLoader({
    id: goalId,
    data: goalsQuery.data,
    updatedAt: goalsQuery.updatedAt,
    find: (item, id) => item.id === id,
    notFoundMessage: "Goal not found.",
  })
  const accounts = useActiveAccounts()

  if (loadState.mode === "new") {
    return <GoalModifyContent goalModifyId={NewEnum.NEW} accounts={accounts} />
  }

  if (loadState.mode === "loading") return <RouteLoadingState />
  if (loadState.mode === "not-found") {
    return <RouteNotFoundState message={loadState.message} />
  }

  return (
    <GoalModifyContent
      key={goalId}
      goalModifyId={goalId}
      goal={loadState.entity}
      accounts={accounts}
    />
  )
}
