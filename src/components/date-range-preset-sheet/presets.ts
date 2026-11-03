import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns"

import { endOfAppWeek, startOfAppWeek } from "~/utils/time-utils"

import type { PresetOption } from "./types"

// Each range reads the clock when it is asked for, not when the module loads:
// the process can stay alive across midnight or a month change.
function getPresetOptions(): PresetOption[] {
  return [
    {
      id: "last30",
      getRange: () => {
        const now = new Date()
        return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) }
      },
    },
    {
      id: "thisWeek",
      getRange: () => {
        const now = new Date()
        return { start: startOfAppWeek(now), end: endOfAppWeek(now) }
      },
    },
    {
      id: "thisMonth",
      getRange: () => {
        const now = new Date()
        return { start: startOfMonth(now), end: endOfMonth(now) }
      },
    },
    {
      id: "thisYear",
      getRange: () => {
        const now = new Date()
        return { start: startOfYear(now), end: endOfYear(now) }
      },
    },
    {
      id: "allTime",
      getRange: () => ({
        start: startOfYear(new Date(2000, 0, 1)),
        end: endOfDay(new Date()),
      }),
    },
  ]
}

export const PRESETS = getPresetOptions()
