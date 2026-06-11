import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgBuildingBank = (props: SvgProps) => (
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
    <Path d="M3 21l18 0" />
    <Path d="M3 10l18 0" />
    <Path d="M5 6l7 -3l7 3" />
    <Path d="M4 10l0 11" />
    <Path d="M20 10l0 11" />
    <Path d="M8 14l0 3" />
    <Path d="M12 14l0 3" />
    <Path d="M16 14l0 3" />
  </Svg>
)
export default SvgBuildingBank
