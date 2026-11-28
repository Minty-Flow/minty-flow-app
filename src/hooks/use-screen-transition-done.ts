import { useNavigation } from "expo-router"
import type { NativeStackNavigationProp } from "expo-router/native-stack"
import type { ParamListBase } from "expo-router/react-navigation"
import { useEffect, useState } from "react"

// Covers screens that appear without a transition, or mount the caller after it.
const FALLBACK_MS = 600

/** False while the screen is still animating in, then true for good. */
export function useScreenTransitionDone(): boolean {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
  const [isDone, setIsDone] = useState(false)
  useEffect(() => {
    const finish = () => setIsDone(true)
    const unsubscribe = navigation.addListener("transitionEnd", finish)
    const fallback = setTimeout(finish, FALLBACK_MS)
    return () => {
      unsubscribe()
      clearTimeout(fallback)
    }
  }, [navigation])
  return isDone
}
