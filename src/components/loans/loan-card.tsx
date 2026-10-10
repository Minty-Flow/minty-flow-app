import { useTranslation } from "react-i18next"
import { type DimensionValue, View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { getLoanDisplay } from "~/components/loans/loan-display"
import { Money } from "~/components/money"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useLanguageStore } from "~/stores/language.store"
import type { Account } from "~/types/accounts"
import type { Loan } from "~/types/loans"

interface LoanCardProps {
  loan: Loan
  /** The loan's account, looked up once by the list instead of per card. */
  account: Account | undefined
  onPress: () => void
}

export function LoanCard({ loan, account, onPress }: LoanCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)

  const {
    isLent,
    paid,
    principal,
    clampedProgress,
    isPaid,
    remaining,
    accentColor,
    mutedColor,
    subtitleParts,
    subtitleColor,
    badgeLabel,
    badgeIcon,
    badgeColor,
    badgeBg,
    progressBarColor,
    isLongTerm,
  } = getLoanDisplay(loan, account, t, theme)
  const progressPercent = Math.round(clampedProgress * 1000) / 10

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={loan.name}
    >
      <View style={styles.row1}>
        <View style={styles.row1Left}>
          <DynamicIcon
            icon={loan.icon}
            size={18}
            colorScheme={loan.colorScheme}
          />
          <View style={styles.nameBlock}>
            <Text variant="default" style={styles.name} numberOfLines={1}>
              {loan.name}
            </Text>
            <Text
              variant="small"
              style={[styles.subtitle, { color: subtitleColor }]}
              numberOfLines={1}
            >
              {subtitleParts.join(" · ")}
            </Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <IconSvg
            name={badgeIcon}
            size={12}
            color={badgeColor}
            style={isRTL ? styles.badgeIconRTL : undefined}
          />
          <Text
            variant="small"
            style={[
              styles.badgeText,
              { color: badgeColor },
              isRTL && styles.badgeTextRTL,
            ]}
          >
            {badgeLabel}
          </Text>
        </View>
      </View>

      {isLongTerm ? (
        <>
          <View style={styles.progressTrack}>
            <RNView
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%` as DimensionValue,
                  backgroundColor: progressBarColor,
                },
              ]}
            />
          </View>

          <View style={styles.row3}>
            <Text variant="small" style={styles.paidLabel}>
              {isLent
                ? t("screens.settings.loans.card.received")
                : t("screens.settings.loans.card.paidBack")}{" "}
              <Money
                value={paid}
                currency={account?.currencyCode ?? ""}
                variant="small"
                tone="transfer"
                hideSign
              />{" "}
              {t("screens.settings.loans.card.of")}{" "}
              <Money
                value={principal}
                currency={account?.currencyCode ?? ""}
                variant="small"
                tone="transfer"
                hideSign
              />
            </Text>

            {isPaid ? (
              <Text
                variant="small"
                style={[styles.rightText, { color: mutedColor }]}
              >
                {t("screens.settings.loans.card.settled")}
              </Text>
            ) : (
              <Money
                value={remaining}
                currency={account?.currencyCode ?? ""}
                variant="small"
                tone="transfer"
                hideSign
                style={{ color: accentColor }}
              />
            )}
          </View>
        </>
      ) : (
        <View style={styles.row3}>
          <Text variant="small" style={styles.paidLabel}>
            {isLent
              ? t("screens.settings.loans.type.lent")
              : t("screens.settings.loans.type.borrowed")}
          </Text>
          <Money
            value={principal}
            currency={account?.currencyCode ?? ""}
            variant="small"
            tone="transfer"
            hideSign
            style={isPaid ? { color: mutedColor } : { color: accentColor }}
          />
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create((t) => ({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius,
    borderWidth: 1,
    borderColor: t.colors.semantic.semi,
    padding: 14,
    gap: 10,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row1Left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...t.typography.bodyLarge,
    fontWeight: "600",
    color: t.colors.onSurface,
  },
  subtitle: {
    fontSize: t.typography.labelSmall.fontSize,
  },
  badge: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: t.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  badgeTextRTL: {
    letterSpacing: 0,
  },
  badgeIconRTL: {
    transform: [{ scaleX: -1 }],
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: t.colors.secondary,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paidLabel: {
    fontSize: t.typography.labelMedium.fontSize,
    color: t.colors.onSecondary,
    flex: 1,
    marginRight: 8,
  },
  rightText: {
    fontSize: t.typography.labelMedium.fontSize,
    flexShrink: 0,
    fontWeight: "600",
  },
}))
