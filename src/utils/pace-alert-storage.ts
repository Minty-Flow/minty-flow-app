import { createMMKV } from "react-native-mmkv"

/**
 * Budget pace-alert bookkeeping, kept out of the DB on purpose (no migration
 * for a notification dedupe flag):
 *  - `alerted`  — budgetId -> periodKey we last notified for, so at most one
 *                 pace notification per budget per period; resets each period.
 *  - `disabled` — budget ids the user opted out of pace alerts for.
 * MMKV so both survive an app restart.
 */
const storage = createMMKV({ id: "budget-pace-alert-storage" })
const ALERTED_KEY = "alertedByBudget"
const DISABLED_KEY = "disabledBudgetIds"

function readMap(): Record<string, string> {
  const raw = storage.getString(ALERTED_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

export function hasPaceAlerted(budgetId: string, periodKey: string): boolean {
  return readMap()[budgetId] === periodKey
}

export function markPaceAlerted(budgetId: string, periodKey: string): void {
  const next = { ...readMap(), [budgetId]: periodKey }
  storage.set(ALERTED_KEY, JSON.stringify(next))
}

function readDisabled(): Set<string> {
  const raw = storage.getString(DISABLED_KEY)
  if (!raw) return new Set()
  try {
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function isPaceAlertDisabledForBudget(budgetId: string): boolean {
  return readDisabled().has(budgetId)
}

export function setPaceAlertDisabledForBudget(
  budgetId: string,
  disabled: boolean,
): void {
  const set = readDisabled()
  if (disabled) set.add(budgetId)
  else set.delete(budgetId)
  storage.set(DISABLED_KEY, JSON.stringify([...set]))
}
