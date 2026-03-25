import { Accelerometer } from "expo-sensors"
import { useEffect, useRef } from "react"

import { useMoneyFormattingStore } from "~/stores/money-formatting.store"

const SHAKE_UPDATE_INTERVAL_MS = 100
const SHAKE_THRESHOLD = 150

export const useShakeListener = () => {
  const maskOnShake = useMoneyFormattingStore((s) => s.maskOnShake)

  const setPrivacyMode = useMoneyFormattingStore((s) => s.setPrivacyMode)

  const subscriptionRef = useRef<{ remove: () => void } | null>(null)

  useEffect(() => {
    if (!maskOnShake) {
      // cleanup if disabled
      subscriptionRef.current?.remove()
      subscriptionRef.current = null
      return
    }

    Accelerometer.setUpdateInterval(SHAKE_UPDATE_INTERVAL_MS)

    let lastX = 0
    let lastY = 0
    let lastZ = 0
    let lastUpdate = 0

    subscriptionRef.current = Accelerometer.addListener(({ x, y, z }) => {
      const now = Date.now()
      const timeDelta = now - lastUpdate

      if (timeDelta > SHAKE_UPDATE_INTERVAL_MS) {
        const speed =
          ((Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ)) /
            timeDelta) *
          10000

        if (speed > SHAKE_THRESHOLD) {
          setPrivacyMode(true)
        }

        lastUpdate = now
        lastX = x
        lastY = y
        lastZ = z
      }
    })

    return () => {
      subscriptionRef.current?.remove()
      subscriptionRef.current = null
    }
  }, [maskOnShake, setPrivacyMode])
}
