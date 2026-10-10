import { useReducer, useRef } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { Platform } from "react-native"

import { DateTimePicker } from "~/components/ui/date-time-picker"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { startOfNextMinute } from "~/utils/pending-transactions"

import { mergeReducer } from "./form-utils"
import type { DatePickerState, DatePickerTarget, RecurringState } from "./types"

type PickerMode = "date" | "time"

export function useFormDatePicker(
  recurring: RecurringState,
  setRecurring: (update: Partial<RecurringState>) => void,
  watch: UseFormWatch<TransactionFormValues>,
  setValue: UseFormSetValue<TransactionFormValues>,
) {
  const [datePicker, setDatePicker] = useReducer(
    mergeReducer<DatePickerState>,
    {
      visible: false,
      mode: "date" as const,
      tempDate: new Date(),
      androidStage: null,
    },
  )
  const datePickerTargetRef = useRef<DatePickerTarget>("transaction")
  // The date and time buttons each edit their own half of the value.
  const mergePart = (base: Date, picked: Date, mode: PickerMode) => {
    const merged = new Date(base)
    if (mode === "date") {
      merged.setFullYear(
        picked.getFullYear(),
        picked.getMonth(),
        picked.getDate(),
      )
    } else {
      merged.setHours(picked.getHours(), picked.getMinutes(), 0, 0)
    }
    return merged
  }
  const currentValue = () =>
    datePickerTargetRef.current === "recurringEnd"
      ? (recurring.until ?? new Date())
      : watch("transactionDate")
  const applyPicked = (picked: Date, mode: PickerMode) => {
    const date = mergePart(currentValue(), picked, mode)
    if (datePickerTargetRef.current === "recurringEnd") {
      setRecurring({ until: date })
      return
    }
    setValue("transactionDate", date, { shouldDirty: true })
    setValue("isPending", date.getTime() > startOfNextMinute().getTime(), {
      shouldDirty: true,
    })
  }
  const openDatePicker = (
    target: DatePickerTarget = "transaction",
    mode: PickerMode = "date",
  ) => {
    datePickerTargetRef.current = target
    const current = currentValue()
    if (Platform.OS === "android") {
      setDatePicker({ androidStage: mode, mode, tempDate: current })
    } else {
      setDatePicker({ mode, tempDate: current, visible: true })
    }
  }
  const confirmIosDate = (date: Date) => {
    applyPicked(date, datePicker.mode)
    setDatePicker({ visible: false })
  }
  const handleSetNow = () => {
    const now = new Date()
    setValue("transactionDate", now, { shouldDirty: true })
    setValue("isPending", now.getTime() > startOfNextMinute().getTime(), {
      shouldDirty: true,
    })
  }
  const pickerElement =
    Platform.OS === "android" && datePicker.androidStage ? (
      <DateTimePicker
        value={datePicker.tempDate}
        mode={datePicker.androidStage}
        display={datePicker.androidStage === "time" ? "spinner" : undefined}
        presentation="dialog"
        onValueChange={(_, picked) => {
          const mode = datePicker.androidStage
          setDatePicker({ androidStage: null })
          if (picked && mode) applyPicked(picked, mode)
        }}
        onDismiss={() => setDatePicker({ androidStage: null })}
      />
    ) : null
  return {
    datePicker,
    setDatePicker,
    openDatePicker,
    confirmIosDate,
    handleSetNow,
    pickerElement,
  }
}
