import type { EventArg } from "expo-router/react-navigation"
import { useEffect, useRef } from "react"

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

export const useNavigationGuard = ({
  navigation,
  when,
  onBlock,
}: UseNavigationGuardOptions): UseNavigationGuardReturn => {
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (e: BeforeRemoveEvent) => {
        if (isNavigatingRef.current || !when) return

        e.preventDefault()
        onBlock()
      },
    )

    return unsubscribe
  }, [navigation, when, onBlock])

  return {
    allowNavigation: () => {
      isNavigatingRef.current = true
      // ponytail: keep true so guard stays disabled after allow
    },
  }
}
