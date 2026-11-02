import { useEffect } from "react"

import { useOnboardingStore } from "~/stores/onboarding.store"

/**
 * Mark an onboarding screen as the step to resume at. Only while onboarding is
 * in progress, so reopening a screen later never reopens onboarding.
 */
export function useOnboardingResume(path: string): void {
  const isInProgress = useOnboardingStore((s) => s.isInProgress)
  const setResumePath = useOnboardingStore((s) => s.setResumePath)
  useEffect(() => {
    if (isInProgress) setResumePath(path)
  }, [isInProgress, path, setResumePath])
}
