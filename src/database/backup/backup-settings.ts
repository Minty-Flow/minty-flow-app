import { TRASH_RETENTION_CHOICES } from "~/constants/trash-retention"
import { LangCodeEnum } from "~/i18n/language.constants"
import { getMinorUnitDigits } from "~/utils/money"

/**
 * Preferences that travel in a full backup, so a restore on a new phone does
 * not reset them. This is an allow-list: a store or field that is not listed
 * here is never exported and is dropped on import.
 *
 * Device-specific state is deliberately absent: app lock, the profile photo
 * (a path into this device's storage), export history, onboarding progress, the
 * development notice and the bill splitter.
 *
 * `version` is the store's persist version. A section saved at another version
 * is ignored rather than guessed at.
 */
export type PortableSettings = Record<
  string,
  { version: number; state: Record<string, unknown> }
>

type Validator = (value: unknown) => boolean

const isBoolean: Validator = (v) => typeof v === "boolean"
const oneOf =
  (...allowed: readonly string[]): Validator =>
  (v) =>
    typeof v === "string" && allowed.includes(v)
const intBetween =
  (min: number, max: number): Validator =>
  (v) =>
    typeof v === "number" && Number.isInteger(v) && v >= min && v <= max
const isCurrency: Validator = (v) => {
  if (typeof v !== "string") return false
  try {
    getMinorUnitDigits(v)
    return true
  } catch {
    return false
  }
}
const isButtonOrder: Validator = (v) =>
  Array.isArray(v) &&
  v.length === 3 &&
  new Set(v).size === 3 &&
  v.every((x) => oneOf("income", "expense", "transfer")(x))

interface SettingsSpec {
  version: number
  fields: Record<string, Validator>
}

export const PORTABLE_SETTINGS: Record<string, SettingsSpec> = {
  language: {
    version: 0,
    fields: { languageCode: oneOf(...Object.values(LangCodeEnum)) },
  },
  moneyFormatting: {
    version: 0,
    fields: {
      preferredCurrency: isCurrency,
      currencyLook: oneOf("symbol", "code", "name"),
      hideOnStartup: isBoolean,
      maskOnShake: isBoolean,
      showBalanceOnHome: isBoolean,
    },
  },
  calendarFormat: {
    version: 0,
    fields: {
      clockFormat: oneOf("auto", "12h", "24h"),
      dateStyle: oneOf("full", "dateOnly", "numeric", "numericOnly"),
      dateOrder: oneOf("default", "mdy", "dmy", "ymd", "ydm"),
    },
  },
  weekStart: {
    version: 0,
    fields: { weekStart: oneOf("auto", "saturday", "sunday", "monday") },
  },
  toastStyle: {
    version: 0,
    fields: {
      position: oneOf("top", "bottom"),
      showProgressBar: isBoolean,
      showCloseIcon: isBoolean,
    },
  },
  buttonPlacement: { version: 0, fields: { order: isButtonOrder } },
  transactionItemAppearance: {
    version: 1,
    fields: {
      variant: oneOf("compact", "elevated"),
      leadingIcon: oneOf("category", "account"),
      showCategory: isBoolean,
      showUntitledForBlankTitle: isBoolean,
    },
  },
  notification: {
    version: 0,
    fields: {
      isDailyReminderEnabled: isBoolean,
      dailyReminderTime: (v) =>
        typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v),
    },
  },
  pendingTransactions: {
    version: 0,
    fields: {
      autoPaySubscriptions: isBoolean,
      autoPayRepetitive: isBoolean,
      autoPayUpcoming: isBoolean,
      updateDateUponConfirmation: isBoolean,
      notify: isBoolean,
      homeTimeframe: intBetween(1, 366),
      earlyReminderInSeconds: intBetween(0, 31 * 86_400),
    },
  },
  trashBin: {
    version: 0,
    fields: {
      retentionPeriod: oneOf(...TRASH_RETENTION_CHOICES.map((c) => c.value)),
    },
  },
  transfersPreferences: {
    version: 0,
    fields: {
      layout: oneOf("combine", "separate"),
      excludeFromTotals: isBoolean,
    },
  },
  transactionLocation: {
    version: 0,
    fields: { isEnabled: isBoolean, autoAttach: isBoolean },
  },
}

/**
 * Reduce an untrusted settings section to what the app can apply: known
 * stores at the current version, with only listed fields holding a valid
 * value. Never throws; anything unreadable is dropped, so a bad section cannot
 * block the data import.
 */
export function sanitizeSettings(raw: unknown): PortableSettings {
  const out: PortableSettings = {}
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return out

  for (const [key, spec] of Object.entries(PORTABLE_SETTINGS)) {
    const section = (raw as Record<string, unknown>)[key]
    if (typeof section !== "object" || section === null) continue
    const { version, state } = section as {
      version?: unknown
      state?: unknown
    }
    if (version !== spec.version) continue
    if (typeof state !== "object" || state === null || Array.isArray(state))
      continue

    const clean: Record<string, unknown> = {}
    for (const [field, isValid] of Object.entries(spec.fields)) {
      const value = (state as Record<string, unknown>)[field]
      if (value !== undefined && isValid(value)) clean[field] = value
    }
    if (Object.keys(clean).length > 0) {
      out[key] = { version: spec.version, state: clean }
    }
  }
  return out
}

/** The listed fields of a store's state, for export. */
export function pickSettings(
  key: string,
  state: Record<string, unknown>,
): PortableSettings[string] {
  const spec = PORTABLE_SETTINGS[key]
  const picked: Record<string, unknown> = {}
  for (const field of Object.keys(spec.fields)) {
    if (state[field] !== undefined) picked[field] = state[field]
  }
  return { version: spec.version, state: picked }
}

/**
 * The profile that travels with a backup. The photo file itself rides in the
 * zip next to `backup.json`; `imageFile` names it. A plain JSON export has
 * no room for the file, so it carries `imageFile: null`.
 */
export interface BackupProfile {
  name: string
  imageFile: string | null
}

// The names the profile screen generates, so an import can never point the
// photo at another file in app storage.
const PROFILE_IMAGE_FILE = /^minty_profile_\d+\.jpg$/

/** A profile section, or null when it is missing or unreadable. */
export function sanitizeProfile(raw: unknown): BackupProfile | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null
  const { name, imageFile } = raw as { name?: unknown; imageFile?: unknown }
  const cleanName = typeof name === "string" ? name.trim().slice(0, 100) : ""
  const cleanImage =
    typeof imageFile === "string" && PROFILE_IMAGE_FILE.test(imageFile)
      ? imageFile
      : null
  if (!cleanName && !cleanImage) return null
  return { name: cleanName, imageFile: cleanImage }
}
