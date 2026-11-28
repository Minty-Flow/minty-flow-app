import { SplashScreen } from "expo-router"

// The longest the splash may cover a start that never reports ready, such as a
// long migration or a crash before the first screen.
const SPLASH_TIMEOUT_MS = 10_000

/** Keeps the splash up until `hideSplash`. Call once, before the first render. */
export function holdSplash(): void {
  SplashScreen.preventAutoHideAsync()
  setTimeout(hideSplash, SPLASH_TIMEOUT_MS)
}

/** Call from whatever the user has to see first. Safe to call again. */
export function hideSplash(): void {
  SplashScreen.hide()
}
