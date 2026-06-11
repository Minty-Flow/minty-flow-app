import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgCurrencyDollar = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2" />
    <Path d="M12 3v3m0 12v3" />
  </Svg>
)
export default SvgCurrencyDollar
