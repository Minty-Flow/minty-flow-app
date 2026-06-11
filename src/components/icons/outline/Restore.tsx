import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgRestore = (props: SvgProps) => (
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
    <Path d="M3.06 13a9 9 0 1 0 .49 -4.087" />
    <Path d="M3 4.001v5h5" />
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
)
export default SvgRestore
