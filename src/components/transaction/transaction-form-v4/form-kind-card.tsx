import { useTranslation } from "react-i18next"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionKind } from "~/types/transactions"

import { formKindCardStyles } from "./form-kind-card.styles"

type Props = {
  kind: TransactionKind
}

export function FormKindCard({ kind }: Props) {
  const { t } = useTranslation()

  switch (kind) {
    case "subscription":
    case "repetitive":
      return (
        <View style={formKindCardStyles.card}>
          <Text variant="small" style={formKindCardStyles.text}>
            {t("components.transactionForm.kind.recurrenceComingSoon")}
          </Text>
        </View>
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
