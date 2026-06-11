import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgFilter2X = (props: SvgProps) => (
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
    <Path d="M4 6h16" />
    <Path d="M6 12h12" />
    <Path d="M9 18h4" />
    <Path d="M22 22l-5 -5m0 5l5 -5" />
  </Svg>
)
export default SvgFilter2X
