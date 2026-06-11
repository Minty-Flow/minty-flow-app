import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgArrowsDiff = (props: SvgProps) => (
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
    <Path d="M11 16h10" />
    <Path d="M11 16l4 4" />
    <Path d="M11 16l4 -4" />
    <Path d="M13 8h-10" />
    <Path d="M13 8l-4 4" />
    <Path d="M13 8l-4 -4" />
  </Svg>
)
export default SvgArrowsDiff
