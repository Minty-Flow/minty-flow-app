import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

const onboardingStorage = createMMKV({ id: "onboarding-storage" })

interface OnboardingStore {
  /** Onboarding is over: the user finished, imported a backup or skipped. */
  isCompleted: boolean
  /**
   * The user chose a path on the start screen but has not finished. Routes
   * outside the `onboarding` segment (custom account, import, profile) stay
   * reachable while this is set, and the next launch offers to resume.
   */
  isInProgress: boolean
  /** The step to resume at, or null for the start screen. */
  resumePath: string | null
  /** Mark onboarding as begun and remember the step to resume at. */
  startOnboarding: (resumePath: string) => void
  /** Remember the latest step reached. */
  setResumePath: (resumePath: string) => void
  setCompleted: () => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isCompleted: false,
      isInProgress: false,
      resumePath: null,
      startOnboarding: (resumePath) => set({ isInProgress: true, resumePath }),
      setResumePath: (resumePath) => set({ resumePath }),
      setCompleted: () =>
        set({ isCompleted: true, isInProgress: false, resumePath: null }),
    }),
    {
      name: "onboarding-store",
      storage: mmkvJSONStorage(onboardingStorage),
    },
  ),
)
