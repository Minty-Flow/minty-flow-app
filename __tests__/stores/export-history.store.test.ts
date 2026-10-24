import { describe, expect, it, vi } from "vitest"

vi.mock("~/utils/mmkv-storage", () => ({
  mmkvJSONStorage: () => ({
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }),
}))
vi.mock("react-native-mmkv", () => ({ createMMKV: () => ({}) }))

import { useExportHistoryStore } from "~/stores/export-history.store"

const record = (n: number) => ({
  uri: `file:///exports/${n}.json`,
  fileName: `${n}.json`,
  type: "json" as const,
  exportedAt: new Date(2026, 0, 1, 0, n).toISOString(),
})

describe("export history", () => {
  it("hands back the entry it pushes out of the history", () => {
    const { addExport } = useExportHistoryStore.getState()
    for (let n = 0; n < 50; n++) expect(addExport(record(n))).toEqual([])

    const evicted = addExport(record(50))

    expect(evicted.map((e) => e.uri)).toEqual(["file:///exports/0.json"])
    expect(useExportHistoryStore.getState().exports).toHaveLength(50)
    expect(useExportHistoryStore.getState().exports[0]?.uri).toBe(
      "file:///exports/50.json",
    )
  })
})
