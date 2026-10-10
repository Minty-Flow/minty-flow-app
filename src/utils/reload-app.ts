import * as Updates from "expo-updates"
import { DevSettings } from "react-native"

/**
 * Reloads the JS bundle. Production builds use expo-updates.
 *
 * In development `Updates.reloadAsync()` always rejects unless the build uses
 * expo-dev-client (its dev launcher makes expo-updates defer to native). This
 * project runs plain debug builds, so fall back to React Native's own dev
 * reload there. Anywhere else (embedded runtime, no reload available) the
 * rejection is swallowed and the change applies on the next cold launch.
 */
export async function reloadApp(): Promise<void> {
  try {
    await Updates.reloadAsync()
  } catch {
    if (__DEV__) DevSettings.reload()
  }
}
