import { describe, expect, it, vi } from "vitest"

vi.mock("~/utils/mmkv-storage", () => ({
  mmkvJSONStorage: () => ({
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }),
}))
vi.mock("react-native-mmkv", () => ({ createMMKV: () => ({}) }))

import { useOnboardingStore } from "~/stores/onboarding.store"

describe("onboarding chosen currency", () => {
  it("keeps the pick until onboarding completes", () => {
    const store = useOnboardingStore.getState()
    expect(useOnboardingStore.getState().chosenCurrency).toBeNull()

    store.setChosenCurrency("EUR")
    expect(useOnboardingStore.getState().chosenCurrency).toBe("EUR")

    store.setCompleted()
    expect(useOnboardingStore.getState().chosenCurrency).toBeNull()
  })
})
