import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, View as RNView, ScrollView } from "react-native"
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
  const { hasData, rows, remainingUnits } = useSafeToSpend()
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  if (!enabled) return null

  const caption =
    cadence === "weekly"
      ? t("components.safeToSpend.captionWeekly")
      : t("components.safeToSpend.captionDaily")

  const unitsLeft =
    cadence === "weekly"
      ? t("components.safeToSpend.weeksLeft", { count: remainingUnits })
      : t("components.safeToSpend.daysLeft", { count: remainingUnits })

  const showEmpty = !hasData || rows.length === 0

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.card}
        onPress={() => !showEmpty && setBreakdownOpen(true)}
        disabled={showEmpty}
      >
        <Text variant="small" style={styles.caption}>
          {caption}
        </Text>

        {showEmpty ? (
          <>
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
            {rows.map((row) => (
              <View key={row.currencyCode} style={styles.currencyRow}>
                <Text variant="small" style={styles.currencyCode}>
                  {row.currencyCode}
                </Text>
                <Money
                  value={row.perUnitMinor}
                  currency={row.currencyCode}
                  variant="large"
                  style={row.isOver ? styles.over : styles.amount}
                />
              </View>
            ))}
            <Text variant="small" style={styles.secondary}>
              {rows.some((r) => r.isOver)
                ? t("components.safeToSpend.someOver")
                : unitsLeft}
            </Text>
          </>
        )}
      </Pressable>

      {!showEmpty && (
        <BreakdownModal
          visible={breakdownOpen}
          rows={rows}
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
  rows,
  cadence,
  onClose,
  onOpenSettings,
}: {
  visible: boolean
  rows: SafeToSpendCurrencyRow[]
  cadence: "daily" | "weekly"
  onClose: () => void
  onOpenSettings: () => void
}) {
  const { t } = useTranslation()

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

            <ScrollView style={styles.modalScroll}>
              {rows.map((row, index) => (
                <CurrencyBreakdown
                  key={row.currencyCode}
                  row={row}
                  cadence={cadence}
                  showHeader={rows.length > 1}
                  isLast={index === rows.length - 1}
                />
              ))}
            </ScrollView>

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

function CurrencyBreakdown({
  row,
  cadence,
  showHeader,
  isLast,
}: {
  row: SafeToSpendCurrencyRow
  cadence: "daily" | "weekly"
  showHeader: boolean
  isLast: boolean
}) {
  const { t } = useTranslation()
  const { breakdown, currencyCode, potMinor, perUnitMinor } = row

  const money = (labelKey: TranslationKey, value: number, tone?: "expense") => (
    <View style={styles.breakdownRow}>
      <Text variant="p" style={styles.breakdownLabel}>
        {t(labelKey)}
      </Text>
      <Money value={value} currency={currencyCode} tone={tone} />
    </View>
  )

  return (
    <View style={[styles.currencyBlock, !isLast && styles.currencyBlockGap]}>
      {showHeader && (
        <Text variant="small" style={styles.currencyBlockTitle}>
          {currencyCode}
        </Text>
      )}
      {money("components.safeToSpend.balance", breakdown.balanceMinor)}
      {money(
        "components.safeToSpend.upcomingIncome",
        breakdown.upcomingIncomeMinor,
      )}
      {money(
        "components.safeToSpend.upcomingBills",
        breakdown.upcomingBillsMinor,
        "expense",
      )}
      {breakdown.goalContributionsMinor > 0 &&
        money(
          "components.safeToSpend.goalContributions",
          breakdown.goalContributionsMinor,
          "expense",
        )}
      <View style={styles.breakdownDivider} />
      {money("components.safeToSpend.pot", potMinor)}
      <View style={styles.breakdownRow}>
        <Text variant="p" style={styles.breakdownLabel}>
          {cadence === "weekly"
            ? t("components.safeToSpend.perWeek")
            : t("components.safeToSpend.perDay")}
        </Text>
        <Money value={perUnitMinor} currency={currencyCode} />
      </View>
    </View>
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
    gap: 6,
    alignItems: "stretch",
    backgroundColor: theme.colors.surface,
  },
  caption: {
    color: theme.colors.onSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
    textAlign: "center",
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencyCode: {
    color: theme.colors.onSurface,
    fontWeight: "700",
    opacity: 0.55,
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
    textAlign: "center",
    marginTop: 2,
  },
  hint: {
    color: theme.colors.onSurface,
    textAlign: "center",
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
    textAlign: "center",
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
    maxHeight: "80%",
    padding: 20,
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius ?? 16,
  },
  modalTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  modalScroll: {
    flexGrow: 0,
  },
  currencyBlock: {
    gap: 8,
  },
  currencyBlockGap: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
  },
  currencyBlockTitle: {
    color: theme.colors.onSecondary,
    fontWeight: "700",
    letterSpacing: 0.5,
    opacity: 0.7,
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
