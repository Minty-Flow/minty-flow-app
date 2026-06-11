import { useLocalSearchParams } from "expo-router"

import { GoalModifyContent } from "~/components/goals/goal-modify/goal-modify-content"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useGoal } from "~/stores/db/goal.store"
import { NewEnum } from "~/types/new"

export default function GoalModifyScreen() {
  const params = useLocalSearchParams<{ goalId: string }>()
  const goalId = params.goalId ?? NewEnum.NEW
  const isAddMode = goalId === NewEnum.NEW || !goalId

  const goal = useGoal(goalId)
  const accounts = useActiveAccounts()

  if (isAddMode) {
    return <GoalModifyContent goalModifyId={NewEnum.NEW} accounts={accounts} />
  }

  return (
    <GoalModifyContent
      key={goalId}
      goalModifyId={goalId}
      goal={goal}
      accounts={accounts}
    />
  )
}
