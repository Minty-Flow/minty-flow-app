import { useMemo } from "react"

import { useProfileStore } from "~/stores/profile.store"
import { resolveProfileImage } from "~/utils/profile-image"

/** The profile photo as a displayable URI, or null to show the fallback. */
export function useProfileImage(): string | null {
  const stored = useProfileStore((s) => s.imageUri)
  return useMemo(() => resolveProfileImage(stored), [stored])
}
