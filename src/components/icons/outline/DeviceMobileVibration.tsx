import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgDeviceMobileVibration = (props: SvgProps) => (
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
    <Path d="M3 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -14" />
    <Path d="M8 4l2 0" />
    <Path d="M9 17l0 .01" />
    <Path d="M21 6l-2 3l2 3l-2 3l2 3" />
  </Svg>
)
export default SvgDeviceMobileVibration
