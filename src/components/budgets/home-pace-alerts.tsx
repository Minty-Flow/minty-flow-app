import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { formatPaceAmount } from "~/components/budgets/pace-warning"
import { IconSvg } from "~/components/icons"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useBudgetsOnPace } from "~/hooks/use-budget-pace"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"

/**
 * Budgets on pace to exceed, one row each, at the top of the home screen.
 * Tapping a row opens the budget. Renders nothing when all are on track.
 */
export function HomePaceAlerts() {
  const { t } = useTranslation()
  const router = useRouter()
  const onPace = useBudgetsOnPace()
  const privacyMode = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)
  if (onPace.length === 0) return null
  return (
    <View style={styles.box}>
      {onPace.map(({ budget, overage }) => (
        <Pressable
          key={budget.id}
          style={styles.row}
          onPress={() =>
            router.push({
              pathname: "/settings/budgets/[budgetId]",
              params: { budgetId: budget.id },
            })
          }
          accessibilityRole="button"
        >
          <IconSvg name="alert-triangle" size={18} color={styles.text.color} />
          <Text variant="small" style={[styles.text, styles.rowText]}>
            {t("screens.settings.budgets.card.paceWarningNamed", {
              name: budget.name,
              amount: formatPaceAmount(overage, budget.currencyCode, {
                currencyLook,
                privacyMode,
              }),
            })}
          </Text>
          <ChevronIcon
            direction="trailing"
            size={16}
            color={styles.text.color}
          />
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  box: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.semantic.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  rowText: { flex: 1 },
  text: {
    color: theme.colors.semantic.warning,
    fontWeight: "600",
  },
}))
