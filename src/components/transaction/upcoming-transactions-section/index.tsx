import { useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import {
  confirmTransaction,
  confirmTransactions,
} from "~/database/services/ledger-service"
import { useRecurringRule } from "~/hooks/use-recurring-rule"
import { useMinuteTick } from "~/hooks/use-time-reactivity"
import {
  autoConfirmationService,
  useAutoConfirmVersion,
} from "~/services/auto-confirmation-service"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import { useUpcomingSectionStore } from "~/stores/upcoming-section.store"
import { confirmable } from "~/utils/pending-transactions"
import { Toast } from "~/utils/toast"
import { applyTransferLayout } from "~/utils/transaction-list-utils"

import { DeleteRecurringSheet } from "../delete-recurring-sheet"
import type { UpcomingRowHandlers } from "./parts"
import type { UpcomingSection, UseUpcomingSectionOptions } from "./types"
import { useAppForeground } from "./use-app-foreground"
import { isUpcoming } from "./utils"

/**
 * The upcoming rows as sections of the transaction list, so only the visible
 * ones mount. `sheets` must be rendered outside the list.
 */
export function useUpcomingSection({
  transactions,
  onTransactionPress,
  horizonDays,
}: UseUpcomingSectionOptions) {
  const { t } = useTranslation()
  const updateDateUponConfirmation = usePendingTransactionsStore(
    (s) => s.updateDateUponConfirmation,
  )
  const transferLayout = useTransfersPreferencesStore((s) => s.layout)
  const tick = useMinuteTick()
  const autoConfirmVersion = useAutoConfirmVersion()
  const foregroundVersion = useAppForeground()
  // Start of NEXT minute so transactions created "now" (with seconds) are not
  // treated as upcoming — matches splitByPendingStatus which uses startOfNextMinute().
  const nowMs = (tick + 1) * 60000
  const upcoming = (() => {
    void autoConfirmVersion
    void foregroundVersion
    const horizonMs =
      horizonDays === undefined ? null : nowMs + horizonDays * 86_400_000
    return transactions.filter(
      (r) =>
        !r.isDeleted &&
        isUpcoming(r) &&
        (horizonMs === null || r.transactionDate.getTime() <= horizonMs),
    )
  })()
  const upcomingForDisplay = applyTransferLayout(upcoming, transferLayout)
  // Pure split for display. Auto-confirmation is owned entirely by
  // autoConfirmationService (driven from useTransactionLifecycleSync); a
  // confirmed row leaves this list via the live query, no effect here.
  const { recurring, pending } = (() => {
    void autoConfirmVersion
    void foregroundVersion
    const recurringList: TransactionWithRelations[] = []
    const pendingList: TransactionWithRelations[] = []
    for (const row of upcomingForDisplay) {
      if (row.recurringId) {
        recurringList.push(row)
      } else {
        pendingList.push(row)
      }
    }
    return { recurring: recurringList, pending: pendingList }
  })()
  const collapsed = useUpcomingSectionStore((s) => s.collapsed)
  const [confirmAllSheetVisible, setConfirmAllSheetVisible] = useState(false)
  // The row stays set after the sheet closes so the sheet keeps its content
  // while it animates out; the next delete replaces it.
  const [recurringToDelete, setRecurringToDelete] =
    useState<TransactionWithRelations | null>(null)
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false)
  const recurringRule = useRecurringRule(recurringToDelete?.recurringId ?? null)
  const handleConfirm = async (transactionId: string) => {
    const opts = { updateTransactionDate: updateDateUponConfirmation }
    try {
      await confirmTransaction(transactionId, opts)
    } catch {
      Toast.error({
        title: t("components.transactionForm.toast.upcomingConfirmFailed"),
      })
    }
  }
  const handleConfirmAll = async () => {
    // Use minute-aligned nowMs (same clock as the UI) so "Confirm All" only
    // confirms transactions that are already shown as confirmable — not ones
    // up to 59 seconds early via a raw Date.now() read.
    const toConfirm = pending.filter((r) => confirmable(r, nowMs))
    if (toConfirm.length === 0) return
    const ids = toConfirm.map((r) => r.id)
    const opts = { updateTransactionDate: updateDateUponConfirmation }
    try {
      await confirmTransactions(ids, opts)
    } catch {
      Toast.error({
        title: t("components.transactionForm.toast.upcomingConfirmAllFailed"),
      })
    }
  }
  const handleBeforeDelete = (row: TransactionWithRelations) => {
    if (row.recurringId) {
      setRecurringToDelete(row)
      setDeleteSheetVisible(true)
      return true
    }
    return false
  }
  const handleDeleteDone = (row: TransactionWithRelations) => {
    autoConfirmationService.cancelSchedule(row.id)
  }
  const openConfirmAllSheet = () => setConfirmAllSheetVisible(true)
  const closeConfirmAllSheet = () => setConfirmAllSheetVisible(false)
  const manualConfirmableCount = pending.filter((r) =>
    confirmable(r, nowMs),
  ).length
  // No data while collapsed, so no rows mount.
  const sections: UpcomingSection[] =
    recurring.length + pending.length === 0
      ? []
      : [
          {
            key: "upcoming",
            upcoming: "summary",
            recurringCount: recurring.length,
            pendingCount: pending.length,
            data: [],
          },
          {
            key: "upcoming-recurring",
            upcoming: "recurring",
            data: collapsed ? [] : recurring,
          },
          {
            key: "upcoming-pending",
            upcoming: "pending",
            data: collapsed ? [] : pending,
            onConfirmAll:
              manualConfirmableCount > 1 ? openConfirmAllSheet : undefined,
          },
        ]
  const sheets = (
    <>
      <ConfirmSheet
        visible={confirmAllSheetVisible}
        onRequestClose={closeConfirmAllSheet}
        onConfirm={handleConfirmAll}
        title={t("screens.home.upcoming.confirmAll.sheetTitle")}
        description={t("screens.home.upcoming.confirmAll.sheetDescription")}
        confirmLabel={t("screens.home.upcoming.confirmAll.button")}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
        icon="check"
      />

      {recurringToDelete &&
        recurringRule &&
        recurringRule.id === recurringToDelete.recurringId && (
          <DeleteRecurringSheet
            visible={deleteSheetVisible}
            transaction={recurringToDelete}
            recurringRule={recurringRule}
            onRequestClose={() => setDeleteSheetVisible(false)}
            onDeleted={() => {
              autoConfirmationService.cancelSchedule(recurringToDelete.id)
              setDeleteSheetVisible(false)
            }}
          />
        )}
    </>
  )
  return {
    sections,
    sheets,
    rowHandlers: {
      onPressId: onTransactionPress,
      onConfirmId: handleConfirm,
      onBeforeDelete: handleBeforeDelete,
      onDeleteRow: handleDeleteDone,
    } satisfies UpcomingRowHandlers,
  }
}
