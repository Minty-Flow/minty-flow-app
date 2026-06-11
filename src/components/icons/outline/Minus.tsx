import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgMinus = (props: SvgProps) => (
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
  </Svg>
)
export default SvgMinus
