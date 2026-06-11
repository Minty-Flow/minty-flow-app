import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgTrashOff = (props: SvgProps) => (
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
    <Path d="M3 3l18 18" />
    <Path d="M4 7h3m4 0h9" />
    <Path d="M10 11l0 6" />
    <Path d="M14 14l0 3" />
    <Path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l.077 -.923" />
    <Path d="M18.384 14.373l.616 -7.373" />
    <Path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
  </Svg>
)
export default SvgTrashOff
