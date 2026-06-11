import type { Account } from "~/types/accounts"
import type { Goal } from "~/types/goals"

export interface GoalModifyContentProps {
  goalModifyId: string
  goal?: Goal
  accounts: Account[]
}
