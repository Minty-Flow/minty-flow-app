import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import type { Account } from "~/types/accounts"
import { TransactionTypeEnum } from "~/types/transactions"

import { DynamicIcon } from "../dynamic-icon"
import { Money } from "../money"
import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"
import { View } from "../ui/view"

export interface AccountCardProps {
  account: Account
  monthIn?: number
  monthOut?: number
  monthNet?: number
  isReorderMode: boolean
  isArchived?: boolean
}

export const AccountCard = ({
  account,
  monthIn = 0,
  monthOut = 0,
  monthNet = 0,
  isReorderMode,
  isArchived = false,
}: AccountCardProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  const handleViewAccount = () => {
    if (!isReorderMode) {
      router.push({
        pathname: "/accounts/[accountId]",
        params: {
          accountId: account.id,
        },
      })
    }
  }

  if (isArchived) {
    return (
      <Pressable style={styles.cardArchived} onPress={handleViewAccount}>
        <DynamicIcon
          icon={account.icon}
          size={32}
          variant="raw"
          colorScheme={null}
        />
        <Text style={styles.archivedName}>{account.name}</Text>
        <Money
          value={account.balance}
          variant="default"
          style={styles.archivedBalance}
          currency={account.currencyCode}
        />
      </Pressable>
    )
  }

  return (
    <Pressable style={styles.card} onPress={handleViewAccount}>
      <View variant="muted" style={styles.cardHeader}>
        <DynamicIcon
          icon={account.icon}
          size={48}
          variant="raw"
          colorScheme={account.colorScheme}
        />
        <View variant="muted" style={styles.accountInfo}>
          <View variant="muted" style={styles.accountNameRow}>
            <Text variant="h3" style={styles.accountName}>
              {account.name}
            </Text>
          </View>
          <View style={styles.accountTypeRow} variant="muted">
            <Text variant="small" style={styles.accountType}>
              {/* {account.type} */}
              {t(`common.account.types.${account.type}`)}
            </Text>
            {account.isPrimary && (
              <View style={styles.primaryBadge}>
                <IconSvg name="star" size={12} />
                <Text style={styles.primaryBadgeText}>
                  {t("screens.accounts.card.primary")}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Money
          value={account.balance}
          variant="h2"
          style={styles.balance}
          currency={account.currencyCode}
        />
      </View>

      <View variant="muted" style={styles.monthlySummary}>
        <Text variant="small" style={styles.summaryLabel}>
          {t("screens.accounts.card.thisMonth")}
        </Text>
        <View variant="muted" style={styles.summaryRow}>
          <View variant="muted" style={styles.summaryItem}>
            <View variant="muted" style={styles.summaryItemHeader}>
              <IconSvg
                name="arrow-down-left"
                size={12}
                color={styles.incomeColor.color}
              />
              <Text style={styles.summaryItemLabel}>
                {t("screens.accounts.card.in")}
              </Text>
            </View>

            <Money
              value={monthIn}
              variant="default"
              style={styles.summaryAmount}
              currency={account.currencyCode}
              tone={TransactionTypeEnum.INCOME}
            />
          </View>
          <View variant="muted" style={styles.summaryItem}>
            <View variant="muted" style={styles.summaryItemHeader}>
              <IconSvg
                name="arrow-up-right"
                size={12}
                color={styles.expenseColor.color}
              />
              <Text style={styles.summaryItemLabel}>
                {t("screens.accounts.card.out")}
              </Text>
            </View>

            <Money
              value={monthOut}
              variant="default"
              style={styles.summaryAmount}
              currency={account.currencyCode}
              // tone={TransactionTypeEnum.EXPENSE}
              showSign
            />
          </View>
          <View variant="muted" style={styles.summaryItem}>
            <View variant="muted" style={styles.summaryItemHeader}>
              <IconSvg
                name="chart-dots"
                size={12}
                color={styles.semiColor.color}
              />
              <Text style={styles.summaryItemLabel}>
                {t("screens.accounts.card.net")}
              </Text>
            </View>

            <Money
              value={monthNet}
              variant="default"
              style={styles.summaryAmount}
              currency={account.currencyCode}
            />
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    padding: 16,
    gap: 12,
  },
  cardArchived: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: `${theme.colors.customColors.semi}50`,
    borderStyle: "dashed",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.secondary,
  },
  archivedName: {
    flex: 1,
    ...theme.typography.bodyLarge,
    color: theme.colors.customColors.semi,
  },
  archivedBalance: {
    ...theme.typography.bodyLarge,
    color: theme.colors.customColors.semi,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accountInfo: {
    flex: 1,
    gap: 2,
  },
  accountNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accountName: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  accountTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  accountType: {
    ...theme.typography.labelXSmall,
    fontWeight: "500",
    color: theme.colors.customColors.semi,

    letterSpacing: 0.5,
  },
  primaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: theme.radius / 2,
  },
  primaryBadgeText: {
    ...theme.typography.labelXSmall,
    color: theme.colors.onSurface,

    letterSpacing: 0.2,
  },
  balance: {
    ...theme.typography.titleMedium,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  monthlySummary: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.customColors.semi,
  },
  summaryLabel: {
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.customColors.semi,

    letterSpacing: 0.8,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
  summaryItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  summaryItemLabel: {
    ...theme.typography.labelXSmall,
    fontWeight: "500",
    color: theme.colors.customColors.semi,

    letterSpacing: 0.5,
  },
  summaryAmount: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  semiColor: {
    color: theme.colors.customColors.semi,
  },
  incomeColor: {
    color: theme.colors.customColors.income,
  },
  expenseColor: {
    color: theme.colors.customColors.expense,
  },
}))
