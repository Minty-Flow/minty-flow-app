import { createContext, type ReactNode, useContext, useMemo } from "react"

interface PagerScrollControlValue {
  setScrollEnabled: (enabled: boolean) => void
}

const PagerScrollControlContext = createContext<PagerScrollControlValue | null>(
  null,
)

export function PagerScrollControlProvider({
  setScrollEnabled,
  children,
}: {
  setScrollEnabled: (enabled: boolean) => void
  children: ReactNode
}) {
  const value = useMemo(() => ({ setScrollEnabled }), [setScrollEnabled])
  return (
    <PagerScrollControlContext.Provider value={value}>
      {children}
    </PagerScrollControlContext.Provider>
  )
}

export function usePagerScrollControl() {
  return useContext(PagerScrollControlContext)
}
