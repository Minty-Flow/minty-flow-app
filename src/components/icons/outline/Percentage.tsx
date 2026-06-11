import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgPercentage = (props: SvgProps) => (
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
    <Path d="M16 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M6 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M6 18l12 -12" />
  </Svg>
)
export default SvgPercentage
