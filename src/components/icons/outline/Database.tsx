import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgDatabase = (props: SvgProps) => (
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
    <Path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
    <Path d="M4 6v6a8 3 0 0 0 16 0v-6" />
    <Path d="M4 12v6a8 3 0 0 0 16 0v-6" />
  </Svg>
)
export default SvgDatabase
