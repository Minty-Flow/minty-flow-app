import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgArrowNarrowLeft = (props: SvgProps) => (
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
    <Path d="M5 12l14 0" />
    <Path d="M5 12l4 4" />
    <Path d="M5 12l4 -4" />
  </Svg>
)
export default SvgArrowNarrowLeft
