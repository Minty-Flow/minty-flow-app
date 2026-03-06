import * as Location from "expo-location"
import { useCallback, useEffect, useRef, useState } from "react"
import type { UseFormSetValue } from "react-hook-form"

import type { TransactionFormValues } from "~/schemas/transactions.schema"
import type { TransactionLocation } from "~/types/transactions"

export function useFormLocation(
  isNew: boolean,
  locationEnabled: boolean,
  autoAttach: boolean,
  setValue: UseFormSetValue<TransactionFormValues>,
  closeLocationPicker: () => void,
) {
  const [isCapturingLocation, setIsCapturingLocation] = useState(false)
  const hasAutoAttachedRef = useRef(false)

  const autoAttachLocation = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync()
      if (status !== Location.PermissionStatus.GRANTED) return
      setIsCapturingLocation(true)
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      setValue(
        "location",
        JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        { shouldDirty: true },
      )
    } catch {
      // Silent failure — user can still add location manually
    } finally {
      setIsCapturingLocation(false)
    }
  }, [setValue])

  useEffect(() => {
    if (!isNew || !locationEnabled || !autoAttach || hasAutoAttachedRef.current)
      return
    hasAutoAttachedRef.current = true
    autoAttachLocation()
  }, [isNew, locationEnabled, autoAttach, autoAttachLocation])

  const handleLocationConfirm = useCallback(
    (loc: TransactionLocation) => {
      setValue("location", JSON.stringify(loc), { shouldDirty: true })
      closeLocationPicker()
    },
    [setValue, closeLocationPicker],
  )

  const handleClearLocation = useCallback(() => {
    setValue("location", undefined, { shouldDirty: true })
  }, [setValue])

  return { isCapturingLocation, handleLocationConfirm, handleClearLocation }
}
