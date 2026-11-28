import { useRouter } from "expo-router"
import { memo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import { useUpcomingSectionStore } from "~/stores/upcoming-section.store"

import { TransactionItem } from "../transaction-item"
import { upcomingSectionStyles as sectionStyles } from "./upcoming-transactions-section.styles"

export function UpcomingSummaryHeader({
  recurringCount,
  pendingCount,
}: {
  recurringCount: number
  pendingCount: number
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const collapsed = useUpcomingSectionStore((s) => s.collapsed)
  const setCollapsed = useUpcomingSectionStore((s) => s.setCollapsed)
  const totalVisible = recurringCount + pendingCount
  return (
    <View style={sectionStyles.wrapper}>
      <Pressable
        style={sectionStyles.headerRow}
        onPress={() => setCollapsed((c) => !c)}
      >
        <View style={sectionStyles.headerLeft}>
          <IconSvg
            name="history-toggle-outline"
            size={18}
            color={theme.colors.semantic.semi}
          />
          <Text style={sectionStyles.headerTitle}>
            {t("screens.home.upcoming.header")}
          </Text>
          {collapsed ? (
            <View style={sectionStyles.collapsedPills}>
              {recurringCount > 0 && (
                <View
                  style={[
                    sectionStyles.miniPill,
                    { backgroundColor: `${theme.colors.semantic.info}18` },
                  ]}
                >
                  <IconSvg
                    name="repeat-outline"
                    size={12}
                    color={theme.colors.semantic.info}
                  />
                  <Text
                    style={[
                      sectionStyles.miniPillText,
                      { color: theme.colors.semantic.info },
                    ]}
                  >
                    {recurringCount}
                  </Text>
                </View>
              )}
              {pendingCount > 0 && (
                <View
                  style={[
                    sectionStyles.miniPill,
                    { backgroundColor: `${theme.colors.semantic.warning}18` },
                  ]}
                >
                  <IconSvg
                    name="history-toggle-outline"
                    size={12}
                    color={theme.colors.semantic.warning}
                  />
                  <Text
                    style={[
                      sectionStyles.miniPillText,
                      { color: theme.colors.semantic.warning },
                    ]}
                  >
                    {pendingCount}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View
              style={[
                sectionStyles.countBadge,
                { backgroundColor: theme.colors.secondary },
              ]}
            >
              <Text style={sectionStyles.countBadgeText}>{totalVisible}</Text>
            </View>
          )}
        </View>

        <IconSvg
          name={collapsed ? "chevron-down-outline" : "chevron-up-outline"}
          size={16}
          color={theme.colors.semantic.semi}
        />
      </Pressable>

      {!collapsed && (
        <>
          <View style={sectionStyles.headerDivider} />

          <View style={sectionStyles.pillRow}>
            {recurringCount > 0 && (
              <View
                style={[
                  sectionStyles.pill,
                  { backgroundColor: `${theme.colors.semantic.info}18` },
                ]}
              >
                <IconSvg
                  name="repeat-outline"
                  size={14}
                  color={theme.colors.semantic.info}
                />
                <Text
                  style={[
                    sectionStyles.pillText,
                    { color: theme.colors.semantic.info },
                  ]}
                >
                  {t("screens.home.upcoming.recurringCount", {
                    count: recurringCount,
                  })}
                </Text>
              </View>
            )}
            {pendingCount > 0 && (
              <View
                style={[
                  sectionStyles.pill,
                  { backgroundColor: `${theme.colors.semantic.warning}18` },
                ]}
              >
                <IconSvg
                  name="history-toggle-outline"
                  size={14}
                  color={theme.colors.semantic.warning}
                />
                <Text
                  style={[
                    sectionStyles.pillText,
                    { color: theme.colors.semantic.warning },
                  ]}
                >
                  {t("screens.home.upcoming.pendingCount", {
                    count: pendingCount,
                  })}
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  )
}

export function UpcomingSubHeader({
  title,
  onConfirmAll,
}: {
  title: string
  /** Shows the "Confirm all" button when given. */
  onConfirmAll?: () => void
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  return (
    <View style={sectionStyles.subHeader}>
      <Text style={sectionStyles.subHeaderText}>{title}</Text>
      <View style={sectionStyles.subHeaderDivider} />
      {onConfirmAll && (
        <Button
          variant="ghost"
          onPress={onConfirmAll}
          style={sectionStyles.confirmAllButton}
          accessibilityLabel={t("screens.home.upcoming.a11y.confirmAll")}
        >
          <IconSvg
            name="checks-outline"
            size={14}
            color={theme.colors.semantic.success}
          />
          <Text
            style={[
              sectionStyles.confirmAllText,
              { color: theme.colors.semantic.success },
            ]}
          >
            {t("screens.home.upcoming.a11y.confirmAllButton")}
          </Text>
        </Button>
      )}
    </View>
  )
}

export function UpcomingFooter() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const router = useRouter()
  return (
    <View style={sectionStyles.seeAllRow}>
      <Button
        variant="link"
        size="sm"
        onPress={() => router.push("/settings/pending-transactions")}
        style={sectionStyles.seeAllButton}
      >
        <Text style={sectionStyles.seeAllText}>
          {t("screens.home.upcoming.seeAll")}
        </Text>

        <ChevronIcon
          direction={"trailing"}
          size={18}
          color={theme.colors.semantic.semi}
        />
      </Button>
    </View>
  )
}

export interface UpcomingRowHandlers {
  onPressId: (transactionId: string) => void
  onConfirmId: (transactionId: string) => void
  onBeforeDelete: (row: TransactionWithRelations) => boolean
  onDeleteRow: (row: TransactionWithRelations) => void
}

export const UpcomingRow = memo(function UpcomingRow({
  item,
  onPressId,
  onConfirmId,
  onBeforeDelete,
  onDeleteRow,
}: UpcomingRowHandlers & { item: TransactionWithRelations }) {
  const { t } = useTranslation()
  const handlePress = useCallback(
    () => onPressId(item.id),
    [onPressId, item.id],
  )
  const handleConfirm = useCallback(
    () => onConfirmId(item.id),
    [onConfirmId, item.id],
  )
  const handleDelete = useCallback(() => onDeleteRow(item), [onDeleteRow, item])
  return (
    <TransactionItem
      transactionWithRelations={item}
      variant="upcoming"
      onPress={handlePress}
      onConfirm={handleConfirm}
      onBeforeDelete={onBeforeDelete}
      onDelete={handleDelete}
      rightActionAccessibilityLabel={t(
        "screens.home.upcoming.a11y.cancelTransaction",
      )}
    />
  )
})
