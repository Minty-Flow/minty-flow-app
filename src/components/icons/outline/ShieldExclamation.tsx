import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgShieldExclamation = (props: SvgProps) => (
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
    <Path d="M15.04 19.745c-.942 .551 -1.964 .976 -3.04 1.255a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 .195 6.015" />
    <Path d="M19 16v3" />
    <Path d="M19 22v.01" />
  </Svg>
)
export default SvgShieldExclamation
