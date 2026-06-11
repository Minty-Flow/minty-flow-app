import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgArrowNarrowUp = (props: SvgProps) => (
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
    <Path d="M12 5l0 14" />
    <Path d="M16 9l-4 -4" />
    <Path d="M8 9l4 -4" />
  </Svg>
)
export default SvgArrowNarrowUp
