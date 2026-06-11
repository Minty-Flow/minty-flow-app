import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgDialpad = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M6 2h-2a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z" />
    <Path d="M20 2h-2a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z" />
    <Path d="M13 2h-2a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z" />
    <Path d="M6 9h-2a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z" />
    <Path d="M20 9h-2a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z" />
    <Path d="M13 9h-2a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z" />
    <Path d="M13 16h-2a2 2 0 0 0 -2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2z" />
  </Svg>
)
export default SvgDialpad
