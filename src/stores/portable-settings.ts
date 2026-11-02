import {
  type BackupProfile,
  type PortableSettings,
  pickSettings,
} from "~/database/backup/backup-settings"
import type { LangCodeType } from "~/i18n/language.constants"
import { notifyFormatChange } from "~/utils/notify-format-change"
import {
  profileImageFileName,
  resolveProfileImage,
} from "~/utils/profile-image"

import { useButtonPlacementStore } from "./button-placement.store"
import { useCalendarFormatStore } from "./calendar-format.store"
import { useLanguageStore } from "./language.store"
import { useMoneyFormattingStore } from "./money-formatting.store"
import { useNotificationStore } from "./notification.store"
import { usePendingTransactionsStore } from "./pending-transactions.store"
import { useProfileStore } from "./profile.store"
import { useToastStyleStore } from "./toast-style.store"
import { useTransactionItemAppearanceStore } from "./transaction-item-appearance.store"
import { useTransactionLocationStore } from "./transaction-location.store"
import { useTransfersPreferencesStore } from "./transfers-preferences.store"
import { useTrashBinStore } from "./trash-bin.store"
import { useWeekStartStore } from "./week-start.store"

/**
 * The bridge between the portable settings allow-list
 * (`backup-settings.ts`) and the live stores. Reads feed an export; writes
 * run after an import has committed.
 */
interface PortableStore {
  read: () => Record<string, unknown>
  /** Apply already-validated state. */
  write: (state: Record<string, unknown>) => void
}

function plain<S extends object>(store: {
  getState: () => S
  setState: (partial: Partial<S>) => void
}): PortableStore {
  return {
    read: () => store.getState() as Record<string, unknown>,
    write: (state) => store.setState(state as Partial<S>),
  }
}

const STORES: Record<string, PortableStore> = {
  // Changing language also switches i18n and the layout direction.
  language: {
    read: () =>
      useLanguageStore.getState() as unknown as Record<string, unknown>,
    write: (state) => {
      useLanguageStore
        .getState()
        .setLanguageCode(state.languageCode as LangCodeType)
    },
  },
  moneyFormatting: plain(useMoneyFormattingStore),
  calendarFormat: {
    ...plain(useCalendarFormatStore),
    write: (state) => {
      useCalendarFormatStore.setState(state)
      notifyFormatChange()
    },
  },
  weekStart: {
    ...plain(useWeekStartStore),
    write: (state) => {
      useWeekStartStore.setState(state)
      notifyFormatChange()
    },
  },
  toastStyle: plain(useToastStyleStore),
  buttonPlacement: plain(useButtonPlacementStore),
  transactionItemAppearance: plain(useTransactionItemAppearanceStore),
  notification: plain(useNotificationStore),
  pendingTransactions: plain(usePendingTransactionsStore),
  trashBin: plain(useTrashBinStore),
  transfersPreferences: plain(useTransfersPreferencesStore),
  transactionLocation: plain(useTransactionLocationStore),
}

/** The portable preferences as they are now, for a backup. */
export function readPortableSettings(): PortableSettings {
  const out: PortableSettings = {}
  for (const [key, store] of Object.entries(STORES)) {
    out[key] = pickSettings(key, store.read())
  }
  return out
}

/** Apply a sanitized settings section. Call only after the import committed. */
export function applyPortableSettings(settings: PortableSettings): void {
  for (const [key, { state }] of Object.entries(settings)) {
    STORES[key]?.write(state)
  }
}

/**
 * The profile for a backup. `imageFile` is set only when the photo exists in
 * app storage and the export can carry the file (a zip).
 */
export function readBackupProfile(includeImage: boolean): BackupProfile | null {
  const { name, imageUri } = useProfileStore.getState()
  const imageFile =
    includeImage && resolveProfileImage(imageUri)
      ? profileImageFileName(imageUri as string)
      : null
  if (!name && !imageFile) return null
  return { name, imageFile }
}

/** The absolute URI of the profile photo to put in a zip, if there is one. */
export function profileImageForExport(): string | null {
  return resolveProfileImage(useProfileStore.getState().imageUri)
}

/**
 * Apply a restored profile. The photo is set only when its file was copied
 * into app storage, so a JSON-only restore keeps the current photo.
 */
export function applyBackupProfile(
  profile: BackupProfile,
  imageRestored: boolean,
): void {
  const { setName, setImageUri } = useProfileStore.getState()
  if (profile.name) setName(profile.name)
  if (imageRestored && profile.imageFile) setImageUri(profile.imageFile)
}
