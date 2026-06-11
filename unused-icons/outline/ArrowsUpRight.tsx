import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsUpRight = (props: SvgProps) => (
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
    <Path d="M17 21l4 -4l-4 -4" />
    <Path d="M21 17h-11a3 3 0 0 1 -3 -3v-11" />
    <Path d="M11 7l-4 -4l-4 4" />
  </Svg>
);
export default SvgArrowsUpRight;
