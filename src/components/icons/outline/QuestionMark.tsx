import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgQuestionMark = (props: SvgProps) => (
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
    <Path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4" />
    <Path d="M12 19l0 .01" />
  </Svg>
)
export default SvgQuestionMark
