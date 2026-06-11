import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgCurrency = (props: SvgProps) => (
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
    <Path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M4 4l3 3" />
    <Path d="M20 4l-3 3" />
    <Path d="M4 20l3 -3" />
    <Path d="M20 20l-3 -3" />
  </Svg>
)
export default SvgCurrency
