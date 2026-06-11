import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgClockBolt = (props: SvgProps) => (
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
    <Path d="M20.984 12.53a9 9 0 1 0 -7.552 8.355" />
    <Path d="M12 7v5l3 3" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
)
export default SvgClockBolt
