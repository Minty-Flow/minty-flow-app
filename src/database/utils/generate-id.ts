import * as Crypto from "expo-crypto"

/**
 * Generate a new universally unique identifier for a database row.
 *
 * Uses `expo-crypto`'s `randomUUID()` which delegates to the platform's
 * cryptographically secure random number generator — `SecureRandom` on Android,
 * `Security.framework` on iOS.
 *
 * All primary keys in the app are UUIDs (v4 format). This function is the
 * single place to swap the ID strategy if needed.
 *
 * @returns A lowercase hyphenated UUID v4 string,
 *   e.g. `"550e8400-e29b-41d4-a716-446655440000"`.
 */
export function generateId(): string {
  return Crypto.randomUUID()
}
