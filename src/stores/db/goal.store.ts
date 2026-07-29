import { useGoalsQuery } from "~/database/drizzle/hooks/use-goals-query"
import type { Goal, GoalType } from "~/types/goals"

export function useAllGoals(): Goal[] {
  return useGoalsQuery().data.filter((goal) => !goal.isArchived)
}

export function useArchivedGoals(): Goal[] {
  return useGoalsQuery().data.filter((goal) => goal.isArchived)
}

export function useGoal(id: string): Goal | undefined {
  return useGoalsQuery().data.find((goal) => goal.id === id)
}

export function useGoalsByType(goalType: GoalType): Goal[] {
  return useAllGoals().filter((goal) => goal.goalType === goalType)
}
