import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgBedFlat = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M5 8a3 3 0 1 1 -3 3l.005 -.176a3 3 0 0 1 2.995 -2.824" />
    <Path d="M18 7a4 4 0 0 1 4 4v2a1 1 0 0 1 -1 1h-11a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1z" />
    <Path d="M21 15a1 1 0 0 1 0 2h-18a1 1 0 0 1 0 -2z" />
  </Svg>
)
export default SvgBedFlat
