import { useRouter } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/services/transaction-service"
import { confirmTransactionSync } from "~/database/services/transaction-service"
import { useRecurringRule } from "~/hooks/use-recurring-rule"
import { useMinuteTick } from "~/hooks/use-time-reactivity"
import {
  autoConfirmationService,
  isPreapproved,
  useAutoConfirmVersion,
} from "~/services/auto-confirmation-service"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import { useUpcomingSectionStore } from "~/stores/upcoming-section.store"
import { confirmable } from "~/utils/pending-transactions"
import { Toast } from "~/utils/toast"
import { applyTransferLayout } from "~/utils/transaction-list-utils"

import { DeleteRecurringModal } from "../delete-recurring-modal"
import { TransactionItem } from "../transaction-item"
import type { UpcomingTransactionsSectionProps } from "./types"
import { upcomingSectionStyles as sectionStyles } from "./upcoming-transactions-section.styles"
import { useAppForeground } from "./use-app-foreground"
import { isUpcoming } from "./utils"

export function UpcomingTransactionsSection({
  transactions,
  onTransactionPress,
}: UpcomingTransactionsSectionProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const isHydrated = usePendingTransactionsStore((s) => s.isHydrated)
  const requireConfirmation = usePendingTransactionsStore(
    (s) => s.requireConfirmation,
  )
  const updateDateUponConfirmation = usePendingTransactionsStore(
    (s) => s.updateDateUponConfirmation,
  )
  const transferLayout = useTransfersPreferencesStore((s) => s.layout)

  const tick = useMinuteTick()
  const autoConfirmVersion = useAutoConfirmVersion()
  const foregroundVersion = useAppForeground()

  // Start of NEXT minute so transactions created "now" (with seconds) are not
  // treated as upcoming — matches splitByPendingStatus which uses startOfNextMinute().
  const nowMs = (tick + 1) * 60_000

  const upcoming = useMemo(() => {
    void autoConfirmVersion
    void foregroundVersion
    return transactions.filter((r) => !r.transaction.isDeleted && isUpcoming(r))
  }, [transactions, autoConfirmVersion, foregroundVersion])

  const upcomingForDisplay = useMemo(
    () => applyTransferLayout(upcoming, transferLayout),
    [upcoming, transferLayout],
  )

  const { recurring, pending, toAutoConfirm } = useMemo(() => {
    void autoConfirmVersion
    void foregroundVersion

    const recurringList: TransactionWithRelations[] = []
    const pendingList: TransactionWithRelations[] = []
    const toAutoConfirmList: string[] = []

    for (const row of upcomingForDisplay) {
      const canConfirm = confirmable(row.transaction, nowMs)
      const preapproved = isPreapproved(row, requireConfirmation)

      if (preapproved && canConfirm) {
        toAutoConfirmList.push(row.transaction.id)
      } else {
        if (row.transaction.recurringId) {
          recurringList.push(row)
        } else {
          pendingList.push(row)
        }
      }
    }

    return {
      recurring: recurringList,
      pending: pendingList,
      toAutoConfirm: toAutoConfirmList,
    }
  }, [
    upcomingForDisplay,
    nowMs,
    requireConfirmation,
    autoConfirmVersion,
    foregroundVersion,
  ])

  useEffect(() => {
    for (const txId of toAutoConfirm) {
      void confirmTransactionSync(txId, {
        updateTransactionDate: updateDateUponConfirmation,
      })
    }
  }, [toAutoConfirm, updateDateUponConfirmation])

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional extra deps
  useEffect(() => {
    if (!isHydrated) return

    // Configure must run before start (start throws if config is null)
    autoConfirmationService.configure({
      requireConfirmation,
      updateDateUponConfirmation,
    })
    autoConfirmationService.start()
    autoConfirmationService.scheduleTransactions(upcoming)
  }, [
    upcoming,
    requireConfirmation,
    updateDateUponConfirmation,
    autoConfirmVersion,
    isHydrated,
  ])

  const router = useRouter()
  const { collapsed, setCollapsed } = useUpcomingSectionStore()
  const [confirmAllModalVisible, setConfirmAllModalVisible] = useState(false)
  const [recurringToDelete, setRecurringToDelete] =
    useState<TransactionWithRelations | null>(null)
  const recurringRule = useRecurringRule(
    recurringToDelete?.transaction.recurringId ?? null,
  )

  const handleConfirm = useCallback(
    async (transactionId: string) => {
      const opts = { updateTransactionDate: updateDateUponConfirmation }
      try {
        await confirmTransactionSync(transactionId, opts)
      } catch {
        Toast.error({
          title: t("components.transactionForm.toast.upcomingConfirmFailed"),
        })
      }
    },
    [updateDateUponConfirmation, t],
  )

  const handleConfirmAll = useCallback(async () => {
    // Use minute-aligned nowMs (same clock as the UI) so "Confirm All" only
    // confirms transactions that are already shown as confirmable — not ones
    // up to 59 seconds early via a raw Date.now() read.
    const toConfirm = pending.filter((r) => confirmable(r.transaction, nowMs))
    if (toConfirm.length === 0) return
    const ids = toConfirm.map((r) => r.transaction.id)
    const opts = { updateTransactionDate: updateDateUponConfirmation }
    try {
      await Promise.all(ids.map((id) => confirmTransactionSync(id, opts)))
    } catch {
      Toast.error({
        title: t("components.transactionForm.toast.upcomingConfirmAllFailed"),
      })
    }
  }, [pending, updateDateUponConfirmation, t, nowMs])

  const openConfirmAllModal = useCallback(
    () => setConfirmAllModalVisible(true),
    [],
  )
  const closeConfirmAllModal = useCallback(
    () => setConfirmAllModalVisible(false),
    [],
  )

  const handleBeforeDelete = useCallback((row: TransactionWithRelations) => {
    if (row.transaction.recurringId) {
      setRecurringToDelete(row)
      return true
    }
    return false
  }, [])

  const handleDeleteDone = useCallback((row: TransactionWithRelations) => {
    autoConfirmationService.cancelSchedule(row.transaction.id)
  }, [])

  const totalVisible = recurring.length + pending.length
  if (totalVisible === 0) return null

  const manualConfirmableCount = pending.filter((r) =>
    confirmable(r.transaction, nowMs),
  ).length

  return (
    <View style={sectionStyles.wrapper}>
      <ConfirmModal
        visible={confirmAllModalVisible}
        onRequestClose={closeConfirmAllModal}
        onConfirm={handleConfirmAll}
        title={t("screens.home.upcoming.confirmAll.modalTitle")}
        description={t("screens.home.upcoming.confirmAll.modalDescription")}
        confirmLabel={t("screens.home.upcoming.confirmAll.button")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
        icon="check"
      />

      {recurringToDelete && recurringRule && (
        <DeleteRecurringModal
          visible={true}
          transaction={recurringToDelete.transaction}
          recurringRule={recurringRule}
          onRequestClose={() => setRecurringToDelete(null)}
          onDeleted={() => {
            autoConfirmationService.cancelSchedule(
              recurringToDelete.transaction.id,
            )
            setRecurringToDelete(null)
          }}
        />
      )}

      <Pressable
        style={sectionStyles.headerRow}
        onPress={() => setCollapsed((c) => !c)}
      >
        <View style={sectionStyles.headerLeft}>
          <Text style={sectionStyles.headerTitle}>
            {t("screens.home.upcoming.header")}
          </Text>
          <View
            style={[
              sectionStyles.countBadge,
              { backgroundColor: theme.colors.secondary },
            ]}
          >
            <Text style={sectionStyles.countBadgeText}>{totalVisible}</Text>
          </View>
        </View>

        <View style={sectionStyles.headerRight}>
          <IconSvg
            name={collapsed ? "chevron-down" : "chevron-up"}
            size={16}
            color={theme.colors.customColors.semi}
          />
        </View>
      </Pressable>

      {!collapsed && (
        <>
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
                color={theme.colors.customColors.semi}
              />
            </Button>
          </View>

          <View style={sectionStyles.pillRow}>
            {recurring.length > 0 && (
              <View
                style={[
                  sectionStyles.pill,
                  { backgroundColor: `${theme.colors.customColors.info}18` },
                ]}
              >
                <IconSvg
                  name="repeat"
                  size={14}
                  color={theme.colors.customColors.info}
                />
                <Text
                  style={[
                    sectionStyles.pillText,
                    { color: theme.colors.customColors.info },
                  ]}
                >
                  {t("screens.home.upcoming.recurringCount", {
                    count: recurring.length,
                  })}
                </Text>
              </View>
            )}
            {pending.length > 0 && (
              <View
                style={[
                  sectionStyles.pill,
                  { backgroundColor: `${theme.colors.customColors.warning}18` },
                ]}
              >
                <IconSvg
                  name="clock"
                  size={14}
                  color={theme.colors.customColors.warning}
                />
                <Text
                  style={[
                    sectionStyles.pillText,
                    { color: theme.colors.customColors.warning },
                  ]}
                >
                  {t("screens.home.upcoming.pendingCount", {
                    count: pending.length,
                  })}
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      {!collapsed && (
        <View style={sectionStyles.listContainer}>
          {recurring.length > 0 && (
            <>
              <View style={sectionStyles.subHeader}>
                <Text style={sectionStyles.subHeaderText}>
                  {t("screens.home.upcoming.subHeaderRecurring")}
                </Text>
              </View>
              {recurring.map((row) => (
                <TransactionItem
                  key={row.transaction.id}
                  transactionWithRelations={row}
                  variant="upcoming"
                  onPress={() => onTransactionPress(row.transaction.id)}
                  onConfirm={() => handleConfirm(row.transaction.id)}
                  onBeforeDelete={handleBeforeDelete}
                  onDelete={() => handleDeleteDone(row)}
                  rightActionAccessibilityLabel={t(
                    "screens.home.upcoming.a11y.cancelTransaction",
                  )}
                />
              ))}
            </>
          )}

          {pending.length > 0 && (
            <>
              <View style={sectionStyles.subHeader}>
                <Text style={sectionStyles.subHeaderText}>
                  {t("screens.home.upcoming.a11y.header")}
                </Text>
                {manualConfirmableCount > 1 && (
                  <Button
                    variant="ghost"
                    onPress={openConfirmAllModal}
                    style={sectionStyles.confirmAllButton}
                    accessibilityLabel={t(
                      "screens.home.upcoming.a11y.confirmAll",
                    )}
                  >
                    <IconSvg
                      name="checks"
                      size={14}
                      color={theme.colors.customColors.success}
                    />
                    <Text
                      style={[
                        sectionStyles.confirmAllText,
                        { color: theme.colors.customColors.success },
                      ]}
                    >
                      {t("screens.home.upcoming.a11y.confirmAllButton")}
                    </Text>
                  </Button>
                )}
              </View>
              {pending.map((row) => (
                <TransactionItem
                  key={row.transaction.id}
                  transactionWithRelations={row}
                  variant="upcoming"
                  onPress={() => onTransactionPress(row.transaction.id)}
                  onConfirm={() => handleConfirm(row.transaction.id)}
                  onBeforeDelete={handleBeforeDelete}
                  onDelete={() => handleDeleteDone(row)}
                  rightActionAccessibilityLabel={t(
                    "screens.home.upcoming.a11y.cancelTransaction",
                  )}
                />
              ))}
            </>
          )}
        </View>
      )}
    </View>
  )
}
