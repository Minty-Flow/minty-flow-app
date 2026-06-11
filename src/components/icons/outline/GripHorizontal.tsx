import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgGripHorizontal = (props: SvgProps) => (
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
    <Path d="M4 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M4 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M18 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M18 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
)
export default SvgGripHorizontal
