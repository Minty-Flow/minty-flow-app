import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgArchiveOff = (props: SvgProps) => (
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
    <Path d="M8 4h11a2 2 0 1 1 0 4h-7m-4 0h-3a2 2 0 0 1 -.826 -3.822" />
    <Path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 1.824 -1.18m.176 -3.82v-7" />
    <Path d="M10 12h2" />
    <Path d="M3 3l18 18" />
  </Svg>
)
export default SvgArchiveOff
