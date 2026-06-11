import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgPasswordMobilePhone = (props: SvgProps) => (
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
    <Path d="M12 17v4" />
    <Path d="M10 20l4 -2" />
    <Path d="M10 18l4 2" />
    <Path d="M5 17v4" />
    <Path d="M3 20l4 -2" />
    <Path d="M3 18l4 2" />
    <Path d="M19 17v4" />
    <Path d="M17 20l4 -2" />
    <Path d="M17 18l4 2" />
    <Path d="M7 14v-8a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v8" />
    <Path d="M11 5h2" />
    <Path d="M12 17v.01" />
  </Svg>
)
export default SvgPasswordMobilePhone
