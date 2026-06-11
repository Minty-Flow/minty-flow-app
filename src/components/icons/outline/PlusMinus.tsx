import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgPlusMinus = (props: SvgProps) => (
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
    <Path d="M4 7h6" />
    <Path d="M7 4v6" />
    <Path d="M20 18h-6" />
    <Path d="M5 19l14 -14" />
  </Svg>
)
export default SvgPlusMinus
