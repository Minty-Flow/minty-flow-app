import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgDeviceMobileOff = (props: SvgProps) => (
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
    <Path d="M7.159 3.185c.256 -.119 .54 -.185 .841 -.185h8a2 2 0 0 1 2 2v9m0 4v1a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-13" />
    <Path d="M11 4h2" />
    <Path d="M3 3l18 18" />
    <Path d="M12 17v.01" />
  </Svg>
)
export default SvgDeviceMobileOff
