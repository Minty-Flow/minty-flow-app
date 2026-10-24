import { describe, expect, it } from "vitest"

import { escapeCsvField, escapeCsvText } from "~/utils/csv"

describe("escapeCsvField", () => {
  it("quotes commas, quotes and line breaks", () => {
    expect(escapeCsvField("a,b")).toBe('"a,b"')
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""')
    expect(escapeCsvField("a\nb")).toBe('"a\nb"')
  })

  it("leaves a negative number alone", () => {
    expect(escapeCsvField("-5.00")).toBe("-5.00")
  })

  it("writes null and undefined as empty", () => {
    expect(escapeCsvField(null)).toBe("")
    expect(escapeCsvField(undefined)).toBe("")
  })
})

describe("escapeCsvText", () => {
  it("defuses text a spreadsheet would run as a formula", () => {
    for (const lead of ["=", "+", "-", "@"]) {
      expect(escapeCsvText(`${lead}SUM(A1)`)).toBe(`'${lead}SUM(A1)`)
    }
  })

  it("still quotes after prefixing", () => {
    expect(escapeCsvText('=HYPERLINK("x","y")')).toBe(
      `"'=HYPERLINK(""x"",""y"")"`,
    )
  })

  it("leaves ordinary text alone", () => {
    expect(escapeCsvText("Groceries")).toBe("Groceries")
    expect(escapeCsvText("a-b")).toBe("a-b")
  })
})
