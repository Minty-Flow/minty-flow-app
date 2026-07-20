import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { NetWorthChart } from "~/components/stats/net-worth-chart"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { StatsSupplement } from "~/types/stats"
import { formatRangeLabel } from "~/utils/stats-date-range"

function ByAccountList({
  accounts,
  currency,
}: {
  accounts: StatsSupplement["accountBalanceSummary"]
  currency: string
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const included = accounts.filter((a) => !a.excludeFromBalance)
  const maxAbs = Math.max(...included.map((a) => Math.abs(a.balance)), 1)

  if (included.length === 0) return null

  return (
    <View style={styles.accountsCard}>
      <Text variant="muted" style={styles.sectionTitle}>
        {t("screens.stats.netWorth.byAccount")}
      </Text>
      {included.map((account) => {
        const scheme = getThemeStrict(account.colorSchemeName)
        const color = scheme?.primary ?? theme.colors.primary
        return (
          <View key={account.accountId} style={styles.accountRow}>
            <View style={styles.accountTop}>
              <DynamicIcon
                icon={account.icon}
                size={16}
                colorScheme={scheme}
                variant="raw"
              />
              <Text
                variant="small"
                style={styles.accountName}
                numberOfLines={1}
              >
                {account.accountName}
              </Text>
              <Money
                value={account.balance}
                currency={currency}
                tone="transfer"
                compact
                variant="small"
                style={styles.accountBalance}
              />
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: color,
                    width: `${Math.max(4, (Math.abs(account.balance) / maxAbs) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default function StatsNetWorthScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <StatsDetailShell init={{ preset: "thisYear" }}>
      {({ stats, supplement, dateRange }) => {
        const deltaUp = stats.balanceDelta >= 0
        return (
          <>
            <View style={styles.header}>
              <Money
                value={supplement?.currentNetBalance ?? stats.closingBalance}
                currency={stats.currency}
                tone="transfer"
                variant="h2"
                style={styles.total}
              />
              <View style={styles.deltaRow}>
                <IconSvg
                  name={
                    deltaUp ? "trending-up-outline" : "trending-down-outline"
                  }
                  size={16}
                  color={
                    deltaUp
                      ? theme.colors.semantic.income
                      : theme.colors.semantic.expense
                  }
                />
                <Money
                  value={stats.balanceDelta}
                  currency={stats.currency}
                  tone="transfer"
                  visualTone={deltaUp ? "income" : "expense"}
                  showSign
                  compact
                  variant="small"
                />
                <Text variant="muted">
                  {t("screens.stats.dashboard.inPeriod", {
                    period: formatRangeLabel(dateRange),
                  })}
                </Text>
              </View>
            </View>

            <NetWorthChart
              timeline={stats.balanceTimeline}
              currency={stats.currency}
              interval={dateRange.interval}
            />

            <ByAccountList
              accounts={supplement?.accountBalanceSummary ?? []}
              currency={stats.currency}
            />
          </>
        )
      }}
    </StatsDetailShell>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    gap: 4,
    paddingVertical: 8,
  },
  total: {
    fontWeight: "700",
  },
  deltaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  accountsCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    ...theme.typography.labelMedium,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  accountRow: {
    gap: 6,
  },
  accountTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accountName: {
    flex: 1,
  },
  accountBalance: {
    fontWeight: "600",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: `${theme.colors.onSurface}14`,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
}))
