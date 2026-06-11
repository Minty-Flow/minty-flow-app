import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgFingerprint = (props: SvgProps) => (
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
    <Path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" />
    <Path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" />
    <Path d="M12 11v2a14 14 0 0 0 2.5 8" />
    <Path d="M8 15a18 18 0 0 0 1.8 6" />
    <Path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" />
  </Svg>
)
export default SvgFingerprint
