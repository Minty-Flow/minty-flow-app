import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns"

import { getWeekStartsOn } from "~/utils/get-week-start-on"

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
      getRange: () => {
        const weekStartsOn = getWeekStartsOn()
        return {
          start: startOfWeek(now, { weekStartsOn }),
          end: endOfWeek(now, { weekStartsOn }),
        }
      },
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
