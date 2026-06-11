import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRampLeft = (props: SvgProps) => (
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
    <Path d="M17 3l0 8.707" />
    <Path d="M13 7l4 -4l4 4" />
    <Path d="M7 14l-4 -4l4 -4" />
    <Path d="M17 21a11 11 0 0 0 -11 -11h-3" />
  </Svg>
);
export default SvgArrowRampLeft;
