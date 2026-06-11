import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgBuilding = (props: SvgProps) => (
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
    <Path d="M9 8l1 0" />
    <Path d="M9 12l1 0" />
    <Path d="M9 16l1 0" />
    <Path d="M14 8l1 0" />
    <Path d="M14 12l1 0" />
    <Path d="M14 16l1 0" />
    <Path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
  </Svg>
)
export default SvgBuilding
