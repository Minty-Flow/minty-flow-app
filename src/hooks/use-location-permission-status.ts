import * as Location from "expo-location"
import { useCallback, useEffect, useState } from "react"
import { AppState, type AppStateStatus } from "react-native"

/**
 * Hook that tracks location (foreground) permission status and updates when app becomes active.
 * Returns current status (null until first check) and a refresh function for after requesting permission.
 */
export function useLocationPermissionStatus() {
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null)

  const refreshPermissionStatus = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync()
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
