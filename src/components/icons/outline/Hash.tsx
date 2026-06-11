import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgHash = (props: SvgProps) => (
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
    <Path d="M5 9l14 0" />
    <Path d="M5 15l14 0" />
    <Path d="M11 4l-4 16" />
    <Path d="M17 4l-4 16" />
  </Svg>
)
export default SvgHash
