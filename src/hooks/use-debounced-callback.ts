import { useCallback, useEffect, useRef } from "react"
/**
 * Trailing debounce: each call resets the timer, `fn` fires `delayMs` after the
 * last call. The returned callback keeps its identity when `fn` changes, so it
 * is safe in an effect's dependencies; the latest `fn` is the one that runs.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): (...args: Args) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)
  useEffect(() => {
    fnRef.current = fn
  })
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])
  return useCallback(
    (...args: Args) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => fnRef.current(...args), delayMs)
    },
    [delayMs],
  )
}
