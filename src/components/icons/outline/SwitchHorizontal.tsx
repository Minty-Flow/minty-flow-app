import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgSwitchHorizontal = (props: SvgProps) => (
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
    <Path d="M16 3l4 4l-4 4" />
    <Path d="M10 7l10 0" />
    <Path d="M8 13l-4 4l4 4" />
    <Path d="M4 17l9 0" />
  </Svg>
)
export default SvgSwitchHorizontal
