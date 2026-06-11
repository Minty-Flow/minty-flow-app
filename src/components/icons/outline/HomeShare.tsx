import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgHomeShare = (props: SvgProps) => (
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
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h2c.247 0 .484 .045 .702 .127" />
    <Path d="M19 12h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h5" />
    <Path d="M16 22l5 -5" />
    <Path d="M21 21.5v-4.5h-4.5" />
  </Svg>
)
export default SvgHomeShare
