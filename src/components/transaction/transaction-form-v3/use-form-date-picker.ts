import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import { useCallback, useReducer, useRef } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { Platform } from "react-native"

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
    },
  )
  const datePickerTargetRef = useRef<DatePickerTarget>("transaction")

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
        DateTimePickerAndroid.open({
          value: current,
          mode: "date",
          display: "calendar",
          onChange: (_evt, selectedDate) => {
            if (selectedDate && _evt.type === "set") {
              setDatePicker({ tempDate: selectedDate })
              DateTimePickerAndroid.open({
                value: selectedDate,
                mode: "time",
                display: "spinner",
                onChange: (evt, timeDate) => {
                  if (timeDate && evt.type === "set") {
                    const t = datePickerTargetRef.current
                    if (t === "recurringStart")
                      setRecurring({ startDate: timeDate })
                    else if (t === "recurringEnd")
                      setRecurring({ endDate: timeDate })
                    else {
                      setValue("transactionDate", timeDate, {
                        shouldDirty: true,
                      })
                      setValue(
                        "isPending",
                        timeDate.getTime() > startOfNextMinute().getTime(),
                        { shouldDirty: true },
                      )
                    }
                  }
                },
              })
            }
          },
        })
      } else {
        setDatePicker({ mode: "date", visible: true })
      }
    },
    [watch, setValue, recurring.startDate, recurring.endDate, setRecurring],
  )

  const handleIosDateChange = useCallback(
    (_evt: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) setDatePicker({ tempDate: selectedDate })
    },
    [],
  )

  const confirmIosDate = useCallback(() => {
    if (datePicker.mode === "time") {
      const tgt = datePickerTargetRef.current
      if (tgt === "recurringStart")
        setRecurring({ startDate: datePicker.tempDate })
      else if (tgt === "recurringEnd")
        setRecurring({ endDate: datePicker.tempDate })
      else {
        setValue("transactionDate", datePicker.tempDate, { shouldDirty: true })
        setValue(
          "isPending",
          datePicker.tempDate.getTime() > startOfNextMinute().getTime(),
          { shouldDirty: true },
        )
      }
      setDatePicker({ visible: false })
    } else {
      setDatePicker({ mode: "time" })
    }
  }, [datePicker.mode, datePicker.tempDate, setValue, setRecurring])

  const handleSetNow = useCallback(() => {
    const now = new Date()
    setValue("transactionDate", now, { shouldDirty: true })
    setValue("isPending", now.getTime() > startOfNextMinute().getTime(), {
      shouldDirty: true,
    })
  }, [setValue])

  return {
    datePicker,
    setDatePicker,
    openDatePicker,
    handleIosDateChange,
    confirmIosDate,
    handleSetNow,
  }
}
