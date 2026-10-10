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

function getPresetOptions(): PresetOption[] {
  const now = new Date()
  return [
    {
      id: "last30",
      label: "Last 30 days",
      getRange: () => ({
        start: startOfDay(subDays(now, 29)),
        end: endOfDay(now),
      }),
    },
    {
      id: "thisWeek",
      label: "This week",
      getRange: () => ({
        start: startOfAppWeek(now),
        end: endOfAppWeek(now),
      }),
    },
    {
      id: "thisMonth",
      label: "This month",
      getRange: () => ({
        start: startOfMonth(now),
        end: endOfMonth(now),
      }),
    },
    {
      id: "thisYear",
      label: "This year",
      getRange: () => ({
        start: startOfYear(now),
        end: endOfYear(now),
      }),
    },
    {
      id: "allTime",
      label: "All time",
      getRange: () => ({
        start: startOfYear(new Date(2000, 0, 1)),
        end: endOfDay(now),
      }),
    },
  ]
}

export const PRESETS = getPresetOptions()
