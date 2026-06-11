import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRotaryLeft = (props: SvgProps) => (
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
    <Path d="M16 10a3 3 0 1 1 0 -6a3 3 0 0 1 0 6" />
    <Path d="M16 10v10" />
    <Path d="M13 7h-10" />
    <Path d="M7 11l-4 -4l4 -4" />
  </Svg>
);
export default SvgArrowRotaryLeft;
