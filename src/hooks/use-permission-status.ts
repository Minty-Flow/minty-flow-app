import * as Location from "expo-location"
import * as Notifications from "expo-notifications"
import { useCallback, useEffect, useState } from "react"
import { AppState, type AppStateStatus } from "react-native"

/**
 * Tracks a permission's status and re-checks whenever the app becomes active
 * (the user may have changed it in system settings). Returns the status (null
 * until the first check) and a refresh function for after requesting it.
 */
function usePermissionStatus<S>(getStatus: () => Promise<{ status: S }>) {
  const [permissionStatus, setPermissionStatus] = useState<S | null>(null)
  // getStatus is a module-level function, so this stays stable.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  const refreshPermissionStatus = useCallback(async () => {
    const { status } = await getStatus()
    setPermissionStatus(status)
  }, [])
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          refreshPermissionStatus()
        }
      },
    )
    refreshPermissionStatus()
    return () => subscription.remove()
  }, [refreshPermissionStatus])
  return { permissionStatus, refreshPermissionStatus }
}

/** Foreground location permission status. */
export function useLocationPermissionStatus() {
  return usePermissionStatus(Location.getForegroundPermissionsAsync)
}

/** Notification permission status. */
export function useNotificationPermissionStatus() {
  return usePermissionStatus(Notifications.getPermissionsAsync)
}
