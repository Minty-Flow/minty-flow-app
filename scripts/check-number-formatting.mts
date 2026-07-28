import assert from "node:assert/strict"
import fs from "node:fs"
import { registerHooks } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"

const root = path.resolve(import.meta.dirname, "..")

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("~/")) return nextResolve(specifier, context)
    return nextResolve(
      pathToFileURL(path.join(root, "src", `${specifier.slice(2)}.ts`)).href,
      context,
    )
  },
})

const moneyModule = "../src/utils/money.ts"
const numberFormatModule = "../src/utils/number-format.ts"
const { parseMajorUnits } = await import(moneyModule)
const { formatEditableNumber, formatMoney, formatNumber, formatPercent } =
  await import(numberFormatModule)

assert.equal(formatMoney(6730, "USD"), "$67.3")
assert.equal(formatMoney(6730, "JPY", { hideSymbol: true }), "6,730")
assert.equal(formatMoney(67_300, "BHD", { hideSymbol: true }), "67.3")
assert.equal(
  formatMoney(12_345_678, "BTC", { hideSymbol: true }),
  "0.12345678",
)
assert.equal(
  formatMoney(Number.MAX_SAFE_INTEGER, "BTC", { hideSymbol: true }),
  "90,071,992.54740991",
)
assert.equal(formatEditableNumber("1234567.00"), "1,234,567.00")
assert.equal(formatNumber(1234.567, { maximumFractionDigits: 2 }), "1,234.57")
assert.equal(formatPercent(33.333), "33.3%")
assert.equal(parseMajorUnits("1,234.56", "USD"), 123_456)
assert.throws(() => parseMajorUnits("١٢٣٤٫٥٦", "USD"))
assert.throws(() => parseMajorUnits("12,34.56", "USD"))
assert.throws(() => parseMajorUnits("1.234", "USD"))

const forbidden = [
  /\.toFixed\(/,
  /\.toLocaleString\(/,
  /new Intl\.NumberFormat\(/,
  /\bformatDisplayValue\b/,
]
const allowed = new Set([
  path.join(root, "src/components/transaction/location-picker-modal.tsx"),
])

for (const directory of ["src/app", "src/components"]) {
  const files = fs
    .globSync(`${directory}/**/*.{ts,tsx}`, { cwd: root })
    .map((file) => path.join(root, file))
  for (const file of files) {
    if (allowed.has(file)) continue
    const source = fs.readFileSync(file, "utf8")
    assert.equal(
      forbidden.some((pattern) => pattern.test(source)),
      false,
      `Direct number formatting found in ${path.relative(root, file)}`,
    )
  }
}

console.log("Number formatting checks passed.")
