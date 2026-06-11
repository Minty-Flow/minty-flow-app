import { useCallback, useReducer, useRef } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { Platform } from "react-native"

import { DateTimePicker } from "~/components/ui/date-time-picker"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { startOfNextMinute } from "~/utils/pending-transactions"

import { mergeReducer } from "./form-utils"
import type { DatePickerState, DatePickerTarget, RecurringState } from "./types"

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

  const applyTarget = useCallback(
    (date: Date) => {
      const tgt = datePickerTargetRef.current
      if (tgt === "recurringStart") setRecurring({ startDate: date })
      else if (tgt === "recurringEnd") setRecurring({ endDate: date })
      else {
        setValue("transactionDate", date, { shouldDirty: true })
        setValue("isPending", date.getTime() > startOfNextMinute().getTime(), {
          shouldDirty: true,
        })
      }
    },
    [setRecurring, setValue],
  )

  const openDatePicker = useCallback(
    (target: DatePickerTarget = "transaction") => {
      datePickerTargetRef.current = target
      const current =
        target === "recurringStart"
          ? recurring.startDate
          : target === "recurringEnd"
            ? (recurring.endDate ?? new Date())
            : watch("transactionDate")
      setDatePicker({ tempDate: current })
      if (Platform.OS === "android") {
        setDatePicker({ androidStage: "date", tempDate: current })
      } else {
        setDatePicker({ mode: "date", visible: true })
      }
    },
    [watch, recurring.startDate, recurring.endDate],
  )

  const confirmIosDate = useCallback(
    (date: Date) => {
      if (datePicker.mode === "time") {
        applyTarget(date)
        setDatePicker({ visible: false })
      } else {
        setDatePicker({ mode: "time", tempDate: date })
      }
    },
    [datePicker.mode, applyTarget],
  )

  const handleSetNow = useCallback(() => {
    const now = new Date()
    setValue("transactionDate", now, { shouldDirty: true })
    setValue("isPending", now.getTime() > startOfNextMinute().getTime(), {
      shouldDirty: true,
    })
  }, [setValue])

  const pickerElement =
    Platform.OS === "android" && datePicker.androidStage === "date" ? (
      <DateTimePicker
        value={datePicker.tempDate}
        mode="date"
        presentation="dialog"
        onValueChange={(_, selectedDate) => {
          if (selectedDate) {
            setDatePicker({ tempDate: selectedDate, androidStage: "time" })
          } else {
            setDatePicker({ androidStage: null })
          }
        }}
        onDismiss={() => setDatePicker({ androidStage: null })}
      />
    ) : Platform.OS === "android" && datePicker.androidStage === "time" ? (
      <DateTimePicker
        value={datePicker.tempDate}
        mode="time"
        display="spinner"
        presentation="dialog"
        onValueChange={(_, timeDate) => {
          setDatePicker({ androidStage: null })
          if (timeDate) applyTarget(timeDate)
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
