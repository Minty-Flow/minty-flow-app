import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgAffiliate = (props: SvgProps) => (
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
    <Path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275" />
    <Path d="M11.683 12.317l5.759 -5.759" />
    <Path d="M4 5.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <Path d="M17 5.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <Path d="M17 18.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
    <Path d="M4 15.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0" />
  </Svg>
)
export default SvgAffiliate
