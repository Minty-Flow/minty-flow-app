import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowForwardUpDouble = (props: SvgProps) => (
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
    <Path d="M11 14l4 -4l-4 -4" />
    <Path d="M16 14l4 -4l-4 -4" />
    <Path d="M15 10h-7a4 4 0 1 0 0 8h1" />
  </Svg>
);
export default SvgArrowForwardUpDouble;
