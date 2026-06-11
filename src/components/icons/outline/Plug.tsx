import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgPlug = (props: SvgProps) => (
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
    <Path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054" />
    <Path d="M4 20l3.5 -3.5" />
    <Path d="M15 4l-3.5 3.5" />
    <Path d="M20 9l-3.5 3.5" />
  </Svg>
)
export default SvgPlug
