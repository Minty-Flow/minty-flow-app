import { useTranslation } from "react-i18next"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type {
  Recurrence,
  RecurrenceUnit,
  TransactionKind,
} from "~/types/transactions"

import { formKindCardStyles } from "./form-kind-card.styles"
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
  const { t } = useTranslation()

  switch (props.kind) {
    case "subscription":
    case "repetitive":
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
    case "lent":
    case "borrowed":
      return (
        <View style={formKindCardStyles.card}>
          <Text variant="small" style={formKindCardStyles.text}>
            {t("components.transactionForm.kind.loanComingSoon")}
          </Text>
        </View>
      )
    default:
      return null
  }
}
