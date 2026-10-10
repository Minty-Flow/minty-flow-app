import type {
  Recurrence,
  RecurrenceUnit,
  TransactionKind,
} from "~/types/transactions"

import { RecurrenceCard } from "./recurrence-card"

type Props = {
  kind: TransactionKind
  recurrence: Recurrence
  until: Date | null
  occurrenceCount: number | null
  onIntervalChange: (n: number) => void
  onUnitChange: (u: RecurrenceUnit) => void
  onUntilPress: () => void
  onUntilReset: () => void
}

export function FormKindCard(props: Props) {
  if (props.kind === "subscription" || props.kind === "repetitive") {
    return (
      <RecurrenceCard
        recurrence={props.recurrence}
        until={props.until}
        occurrenceCount={props.occurrenceCount}
        onIntervalChange={props.onIntervalChange}
        onUnitChange={props.onUnitChange}
        onUntilPress={props.onUntilPress}
        onUntilReset={props.onUntilReset}
      />
    )
  }
  // lent / borrowed build a one-time loan straight from the main form fields
  // (title -> loan name, date -> due date) — no extra block.
  return null
}
