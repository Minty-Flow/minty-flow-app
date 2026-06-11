import * as Notifications from "expo-notifications"
import { useCallback, useEffect, useState } from "react"
import { AppState, type AppStateStatus } from "react-native"

/**
 * Hook that tracks notification permission status and updates when app becomes active.
 * Returns current status (null until first check) and a refresh function for after requesting permission.
 */
export function useNotificationPermissionStatus() {
  const [permissionStatus, setPermissionStatus] =
    useState<Notifications.PermissionStatus | null>(null)

  const refreshPermissionStatus = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync()
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
