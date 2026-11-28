/**
 * True when both values hold the same data. `ignore` names keys of the top
 * level object that are not compared.
 */
function isSameData(
  a: unknown,
  b: unknown,
  ignore?: ReadonlySet<string>,
): boolean {
  if (Object.is(a, b)) return true
  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
  }
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false
  }
  const left = a as Record<string, unknown>
  const right = b as Record<string, unknown>
  const keys = Object.keys(right)
  return (
    Object.keys(left).length === keys.length &&
    keys.every(
      (key) =>
        ignore?.has(key) || (key in left && isSameData(left[key], right[key])),
    )
  )
}

/**
 * Keeps row objects stable across refreshes: the returned function hands back
 * the previous object for each row (matched by `id`) whose data is unchanged,
 * so memoized rows skip rendering.
 *
 * @param ignored - Per property, the fields of that nested record which do not
 *   make a row different.
 *
 * The returned function's `epoch` names what rows derive from outside their
 * data, such as today's date; a new value replaces every row.
 */
export function createRowReuser<T extends { id: string }>(
  ignored: Partial<Record<keyof T, ReadonlySet<string>>> = {},
) {
  let previous = new Map<string, T>()
  let previousEpoch: string | undefined
  return (rows: T[], epoch?: string): T[] => {
    if (epoch !== previousEpoch) previous.clear()
    previousEpoch = epoch
    const next = new Map<string, T>()
    const result = rows.map((row) => {
      const old = previous.get(row.id)
      const kept =
        old &&
        (Object.keys(row) as (keyof T)[]).every((key) =>
          isSameData(old[key], row[key], ignored[key]),
        )
          ? old
          : row
      next.set(row.id, kept)
      return kept
    })
    previous = next
    return result
  }
}
