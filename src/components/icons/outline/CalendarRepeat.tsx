import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgCalendarRepeat = (props: SvgProps) => (
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
    <Path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v3" />
    <Path d="M16 3v4" />
    <Path d="M8 3v4" />
    <Path d="M4 11h12" />
    <Path d="M20 14l2 2h-3" />
    <Path d="M20 18l2 -2" />
    <Path d="M19 16a3 3 0 1 0 2 5.236" />
  </Svg>
)
export default SvgCalendarRepeat
