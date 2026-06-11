import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsUpLeft = (props: SvgProps) => (
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
    <Path d="M21 7l-4 -4l-4 4" />
    <Path d="M17 3v11a3 3 0 0 1 -3 3h-11" />
    <Path d="M7 13l-4 4l4 4" />
  </Svg>
);
export default SvgArrowsUpLeft;
