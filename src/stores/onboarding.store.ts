import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { mmkvJSONStorage } from "~/utils/mmkv-storage"

const onboardingStorage = createMMKV({ id: "onboarding-storage" })

interface OnboardingStore {
  isCompleted: boolean
  setCompleted: () => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isCompleted: false,
      setCompleted: () => set({ isCompleted: true }),
    }),
    {
      name: "onboarding-store",
      storage: mmkvJSONStorage(onboardingStorage),
    },
  ),
)
