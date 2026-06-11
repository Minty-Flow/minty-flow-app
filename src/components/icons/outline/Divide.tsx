import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgDivide = (props: SvgProps) => (
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
    <Path d="M11 6a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" fill="currentColor" />
    <Path d="M11 18a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" fill="currentColor" />
    <Path d="M5 12l14 0" />
  </Svg>
)
export default SvgDivide
