import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsRightDown = (props: SvgProps) => (
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
    <Path d="M3 17l4 4l4 -4" />
    <Path d="M7 21v-11a3 3 0 0 1 3 -3h11" />
    <Path d="M17 11l4 -4l-4 -4" />
  </Svg>
);
export default SvgArrowsRightDown;
