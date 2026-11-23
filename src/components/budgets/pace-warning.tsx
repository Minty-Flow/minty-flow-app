import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useBudgetPaceOverage } from "~/hooks/use-budget-pace"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { Budget } from "~/types/budgets"
import { roundToSafeInteger } from "~/utils/money"
import { formatMoney } from "~/utils/number-format"

interface Props {
  budget: Budget
  progress: Parameters<typeof useBudgetPaceOverage>[1]
  /** `banner` on the detail screen, a one-line `text` on the card. */
  variant: "banner" | "text"
}

/** "On pace to exceed" warning; renders nothing when the budget is on track. */
export function PaceWarning({ budget, progress, variant }: Props) {
  const { t } = useTranslation()
  const privacyMode = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)
  const overage = useBudgetPaceOverage(budget, progress)
  if (overage === null) return null
  const raw = formatMoney(roundToSafeInteger(overage), budget.currencyCode, {
    currencyDisplay: currencyLook,
    hideSign: true,
  })
  const text = t("screens.settings.budgets.card.paceWarning", {
    amount: privacyMode ? raw.replace(/[\d٠-٩۰-۹]/gu, "⁕") : raw,
  })
  if (variant === "banner")
    return (
      <View style={styles.row}>
        <IconSvg name="alert-triangle" size={18} color={styles.text.color} />
        <Text variant="small" style={[styles.text, styles.rowText]}>
          {text}
        </Text>
      </View>
    )
  return (
    <Text variant="small" style={styles.text}>
      {text}
    </Text>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowText: { flex: 1 },
  text: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.semantic.warning,
    fontWeight: "600",
  },
}))
