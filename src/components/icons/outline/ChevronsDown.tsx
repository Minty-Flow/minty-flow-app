import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgChevronsDown = (props: SvgProps) => (
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
    <Path d="M7 7l5 5l5 -5" />
    <Path d="M7 13l5 5l5 -5" />
  </Svg>
)
export default SvgChevronsDown
