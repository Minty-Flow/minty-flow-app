import * as FileSystem from "expo-file-system/legacy"
import * as IntentLauncher from "expo-intent-launcher"
import { Linking, Platform } from "react-native"

import { getMimeTypeForExtension } from "~/utils/file-icon"

/**
 * Open a local file in an external app (e.g. PDF in a viewer).
 * - Android: converts file:// to content:// via FileProvider and launches VIEW intent
 *   so the system shows "Open with" and avoids "exposed beyond app" error.
 * - iOS: uses Linking.openURL with the file URI.
 */
export async function openFileInExternalApp(
  uri: string,
  ext: string,
): Promise<void> {
  const ALLOWED_SCHEMES = ["file://", "content://"]
  if (!ALLOWED_SCHEMES.some((s) => uri.startsWith(s))) {
    throw new Error(`Blocked unsafe URI scheme: ${uri.split(":")[0]}`)
  }
  if (Platform.OS === "android") {
    const contentUri = await FileSystem.getContentUriAsync(uri)
    const mimeType = getMimeTypeForExtension(ext)
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: contentUri,
      type: mimeType,
      flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
    })
  } else {
    await Linking.openURL(uri)
  }
}
