import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgTrendingDown = (props: SvgProps) => (
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
    <Path d="M3 7l6 6l4 -4l8 8" />
    <Path d="M21 10l0 7l-7 0" />
  </Svg>
)
export default SvgTrendingDown
