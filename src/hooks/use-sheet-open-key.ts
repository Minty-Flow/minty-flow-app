import { useState } from "react"

/**
 * A key that changes each time `visible` turns true. Key a sheet's inner
 * component with it: the sheet starts with fresh state on every open, yet stays
 * mounted while closing so its exit animation can finish.
 */
export function useSheetOpenKey(visible: boolean): number {
  const [state, setState] = useState({ visible, count: visible ? 1 : 0 })
  if (state.visible !== visible) {
    setState({ visible, count: visible ? state.count + 1 : state.count })
  }
  return state.count
}
