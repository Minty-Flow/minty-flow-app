import type { EventArg } from "expo-router/react-navigation"
import { useCallback, useEffect, useRef } from "react"

type BeforeRemoveEvent = EventArg<"beforeRemove", true, { action: unknown }>

/** Navigation object that supports the beforeRemove listener (e.g. from useNavigation()). */
type NavigationWithBeforeRemove = {
  addListener(
    event: "beforeRemove",
    callback: (e: BeforeRemoveEvent) => void,
  ): () => void
}

type UseNavigationGuardOptions = {
  navigation: NavigationWithBeforeRemove
  when: boolean
  onBlock: () => void
}

type UseNavigationGuardReturn = {
  /** Call before programmatic navigation (e.g. after submit/delete or discard) so the guard allows the transition. */
  allowNavigation: () => void
}

function listenBeforeRemove(
  navigation: NavigationWithBeforeRemove,
  callback: (e: BeforeRemoveEvent) => void,
): () => void {
  return navigation.addListener("beforeRemove", callback)
}

export const useNavigationGuard = ({
  navigation,
  when,
  onBlock,
}: UseNavigationGuardOptions): UseNavigationGuardReturn => {
  const isNavigatingRef = useRef(false)
  const block = useCallback(() => {
    onBlock()
  }, [onBlock])

  useEffect(() => {
    return listenBeforeRemove(navigation, (e) => {
      if (isNavigatingRef.current || !when) return

      e.preventDefault()
      block()
    })
  }, [block, navigation, when])

  return {
    allowNavigation: () => {
      isNavigatingRef.current = true
      // ponytail: keep true so guard stays disabled after allow
    },
  }
}
