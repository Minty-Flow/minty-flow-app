export interface LineChartPaths {
  linePath: string
  areaPath: string
  min: number
  max: number
  span: number
  xAt: (index: number) => number
  yAt: (value: number) => number
}

/**
 * SVG-style line and filled-area paths for a series, scaled to `width` x
 * `plotHeight` with `pad` of vertical padding. Shared by the net-worth chart
 * and its card sparkline so the two cannot drift apart. A flat series has a
 * span of 1, so it draws a straight line instead of dividing by zero.
 */
export function buildLineChartPaths(
  values: number[],
  width: number,
  plotHeight: number,
  pad: number,
): LineChartPaths {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const usable = plotHeight - pad * 2
  const last = Math.max(values.length - 1, 1)
  const xAt = (i: number) => (i / last) * width
  const yAt = (v: number) => pad + (1 - (v - min) / span) * usable

  const line: string[] = []
  const area: string[] = []
  values.forEach((value, i) => {
    const x = xAt(i)
    const y = yAt(value)
    if (i === 0) {
      line.push(`M ${x} ${y}`)
      area.push(`M ${x} ${plotHeight}`, `L ${x} ${y}`)
    } else {
      line.push(`L ${x} ${y}`)
      area.push(`L ${x} ${y}`)
    }
  })
  area.push(`L ${width} ${plotHeight}`, "Z")
  return {
    linePath: line.join(" "),
    areaPath: area.join(" "),
    min,
    max,
    span,
    xAt,
    yAt,
  }
}
