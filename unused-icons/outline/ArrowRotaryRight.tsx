import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRotaryRight = (props: SvgProps) => (
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
    <Path d="M5 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M8 10v10" />
    <Path d="M17 11l4 -4l-4 -4" />
    <Path d="M11 7h10" />
  </Svg>
);
export default SvgArrowRotaryRight;
