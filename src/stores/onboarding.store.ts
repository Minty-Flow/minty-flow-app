import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

const onboardingStorage = createMMKV({ id: "onboarding-storage" })

interface OnboardingStore {
  isCompleted: boolean
  setCompleted: () => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    persist(
      (set) => ({
        isCompleted: false,
        setCompleted: () => set({ isCompleted: true }),
      }),
      {
        name: "onboarding",
        storage: createJSONStorage(() => ({
          getItem: (name) => onboardingStorage.getString(name) ?? null,
          setItem: (name, value) => onboardingStorage.set(name, value),
          removeItem: (name) => onboardingStorage.remove(name),
        })),
      },
    ),
    { name: "onboarding-store-dev" },
  ),
)
