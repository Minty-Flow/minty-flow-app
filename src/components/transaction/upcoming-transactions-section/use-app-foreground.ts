import { useSyncExternalStore } from "react"
import { AppState } from "react-native"

let appStateVersion = 0
const appStateListeners = new Set<() => void>()
let appStateSubscriptionRef: { remove: () => void } | null = null

function ensureAppStateSubscription() {
  if (appStateSubscriptionRef) return
  appStateSubscriptionRef = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      appStateVersion++
      for (const cb of appStateListeners) cb()
    }
  })
}

function subscribeAppState(callback: () => void): () => void {
  ensureAppStateSubscription()
  appStateListeners.add(callback)
  return () => {
    appStateListeners.delete(callback)
    if (appStateListeners.size === 0 && appStateSubscriptionRef) {
      appStateSubscriptionRef.remove()
      appStateSubscriptionRef = null
    }
  }
}

function getAppStateSnapshot(): number {
  return appStateVersion
}

/** Re-renders when app comes to foreground. */
export function useAppForeground(): number {
  return useSyncExternalStore(
    subscribeAppState,
    getAppStateSnapshot,
    getAppStateSnapshot,
  )
}
