import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRampRight = (props: SvgProps) => (
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
    <Path d="M7 3l0 8.707" />
    <Path d="M11 7l-4 -4l-4 4" />
    <Path d="M17 14l4 -4l-4 -4" />
    <Path d="M7 21a11 11 0 0 1 11 -11h3" />
  </Svg>
);
export default SvgArrowRampRight;
