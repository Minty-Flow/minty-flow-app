import { describe, expect, it } from "vitest"

import { buildLineChartPaths } from "~/utils/chart-path"

describe("buildLineChartPaths", () => {
  it("scales the first point to the left and the highest value to the top pad", () => {
    const { linePath, xAt, yAt } = buildLineChartPaths([0, 10], 100, 50, 5)
    expect(xAt(0)).toBe(0)
    expect(xAt(1)).toBe(100)
    expect(yAt(10)).toBe(5)
    expect(yAt(0)).toBe(45)
    expect(linePath).toBe("M 0 45 L 100 5")
  })

  it("closes the area down to the plot floor", () => {
    const { areaPath } = buildLineChartPaths([1, 2], 100, 50, 5)
    expect(areaPath.startsWith("M 0 50 L 0 ")).toBe(true)
    expect(areaPath.endsWith("L 100 50 Z")).toBe(true)
  })

  it("draws a flat series as a straight line without dividing by zero", () => {
    const { linePath, span } = buildLineChartPaths([7, 7, 7], 100, 50, 5)
    expect(span).toBe(1)
    expect(linePath).not.toContain("NaN")
  })
})
