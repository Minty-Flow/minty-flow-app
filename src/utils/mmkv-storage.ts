import type { MMKV } from "react-native-mmkv"
import { createJSONStorage } from "zustand/middleware"

/** zustand `persist` storage backed by an MMKV instance. */
export function mmkvJSONStorage<S>(storage: MMKV) {
  return createJSONStorage<S>(() => ({
    getItem: (name) => storage.getString(name) ?? null,
    setItem: (name, value) => storage.set(name, value),
    removeItem: (name) => storage.remove(name),
  }))
}
