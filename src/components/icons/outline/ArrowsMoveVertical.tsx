import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgArrowsMoveVertical = (props: SvgProps) => (
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
    <Path d="M9 18l3 3l3 -3" />
    <Path d="M12 15v6" />
    <Path d="M15 6l-3 -3l-3 3" />
    <Path d="M12 3v6" />
  </Svg>
)
export default SvgArrowsMoveVertical
