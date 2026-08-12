import { useCallback, useRef } from "react"
import type { View } from "react-native"

import { useScrollIntoViewContext } from "~/contexts/scroll-into-view-context"
/**
 * When used inside ScrollIntoViewProvider, returns wrapperRef and scrollIntoView.
 * Call scrollIntoView() when expanding so the ScrollView scrolls to this component.
 * When no provider is present, scrollIntoView is a no-op.
 */
export function useScrollIntoView() {
  const ctx = useScrollIntoViewContext()
  const wrapperRef = useRef<View>(null)
  const scrollIntoView = useCallback(() => {
    if (!ctx || !wrapperRef.current) return
    // Two frames: the caller triggers this alongside a state update (e.g.
    // opening a picker) that changes this element's layout. Measuring on the
    // very next frame can race the native layout pass and scroll to a
    // pre-expansion position, fighting the user's own scroll gesture.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrapperRef.current?.measureInWindow((_, wy: number) => {
          ctx.scrollContainerRef.current?.measureInWindow((_, sy: number) => {
            const targetY = ctx.scrollYRef.current + (wy - sy)
            ctx.scrollRef.current?.scrollTo({
              y: Math.max(0, targetY),
              animated: true,
            })
          })
        })
      })
    })
  }, [ctx])
  return { wrapperRef, scrollIntoView }
}
