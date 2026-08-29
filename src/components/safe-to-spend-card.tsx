import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, View as RNView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Button } from "~/components/ui/button"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type SafeToSpendCurrencyRow,
  useSafeToSpend,
} from "~/database/drizzle/read-models/safe-to-spend-read-model"
import type { TranslationKey } from "~/i18n/config"
import { useSafeToSpendStore } from "~/stores/safe-to-spend.store"

export function SafeToSpendCard() {
  const { t } = useTranslation()
  const router = useRouter()
  const enabled = useSafeToSpendStore((s) => s.enabled)
  const cadence = useSafeToSpendStore((s) => s.cadence)
  const { hasData, headline } = useSafeToSpend()
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  if (!enabled) return null

  const caption =
    cadence === "weekly"
      ? t("components.safeToSpend.captionWeekly")
      : t("components.safeToSpend.captionDaily")

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.card}
        onPress={() => headline && setBreakdownOpen(true)}
        disabled={!headline}
      >
        {!hasData || !headline ? (
          <>
            <Text variant="small" style={styles.caption}>
              {caption}
            </Text>
            <Text variant="p" style={styles.hint}>
              {t("components.safeToSpend.emptyHint")}
            </Text>
            <Text
              variant="small"
              style={styles.link}
              onPress={() => router.push("/settings/preferences/safe-to-spend")}
            >
              {t("components.safeToSpend.emptyCta")}
            </Text>
          </>
        ) : (
          <>
            <Text variant="small" style={styles.caption}>
              {caption}
            </Text>
            <Money
              value={headline.perUnitMinor}
              currency={headline.currencyCode}
              variant="large"
              style={headline.isOver ? styles.over : styles.amount}
            />
            <Text variant="small" style={styles.secondary}>
              {headline.isOver
                ? t("components.safeToSpend.overBy")
                : cadence === "weekly"
                  ? t("components.safeToSpend.weeksLeft", {
                      count: headline.breakdown.remainingUnits,
                    })
                  : t("components.safeToSpend.daysLeft", {
                      count: headline.breakdown.remainingUnits,
                    })}
            </Text>
          </>
        )}
      </Pressable>

      {headline && (
        <BreakdownModal
          visible={breakdownOpen}
          row={headline}
          cadence={cadence}
          onClose={() => setBreakdownOpen(false)}
          onOpenSettings={() => {
            setBreakdownOpen(false)
            router.push("/settings/preferences/safe-to-spend")
          }}
        />
      )}
    </View>
  )
}

function BreakdownModal({
  visible,
  row,
  cadence,
  onClose,
  onOpenSettings,
}: {
  visible: boolean
  row: SafeToSpendCurrencyRow
  cadence: "daily" | "weekly"
  onClose: () => void
  onOpenSettings: () => void
}) {
  const { t } = useTranslation()
  const { breakdown, currencyCode, potMinor, perUnitMinor } = row

  const line = (labelKey: TranslationKey, value: number, tone?: "expense") => (
    <View style={styles.breakdownRow}>
      <Text variant="p" style={styles.breakdownLabel}>
        {t(labelKey)}
      </Text>
      <Money value={value} currency={currencyCode} tone={tone} />
    </View>
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <RNView style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          native
          disableRipple
        />
        <View style={styles.modalContent}>
          <View style={styles.modalCard}>
            <Text variant="h3" style={styles.modalTitle}>
              {t("components.safeToSpend.breakdownTitle")}
            </Text>

            {line("components.safeToSpend.balance", breakdown.balanceMinor)}
            {line(
              "components.safeToSpend.upcomingIncome",
              breakdown.upcomingIncomeMinor,
            )}
            {line(
              "components.safeToSpend.upcomingBills",
              breakdown.upcomingBillsMinor,
              "expense",
            )}
            {breakdown.goalContributionsMinor > 0 &&
              line(
                "components.safeToSpend.goalContributions",
                breakdown.goalContributionsMinor,
                "expense",
              )}

            <View style={styles.breakdownDivider} />
            {line("components.safeToSpend.pot", potMinor)}
            <View style={styles.breakdownRow}>
              <Text variant="p" style={styles.breakdownLabel}>
                {cadence === "weekly"
                  ? t("components.safeToSpend.perWeek")
                  : t("components.safeToSpend.perDay")}
              </Text>
              <Money value={perUnitMinor} currency={currencyCode} />
            </View>

            <Button
              variant="ghost"
              onPress={onOpenSettings}
              style={styles.settingsButton}
            >
              <Text variant="default">
                {t("components.safeToSpend.adjust")}
              </Text>
            </Button>
            <Button variant="default" onPress={onClose}>
              <Text variant="default">{t("common.actions.close")}</Text>
            </Button>
          </View>
        </View>
      </RNView>
    </Modal>
  )
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
    borderRadius: theme.radius,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 4,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  caption: {
    color: theme.colors.onSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  amount: {
    color: theme.colors.onSurface,
    fontWeight: "800",
  },
  over: {
    color: theme.colors.semantic.expense,
    fontWeight: "800",
  },
  secondary: {
    color: theme.colors.onSurface,
    opacity: 0.6,
  },
  hint: {
    color: theme.colors.onSurface,
    textAlign: "center",
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.shadow,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius ?? 16,
  },
  modalTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownLabel: {
    color: theme.colors.onSurface,
    opacity: 0.8,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: theme.colors.semantic.semi,
    marginVertical: 4,
  },
  settingsButton: {
    marginTop: 4,
  },
}))
