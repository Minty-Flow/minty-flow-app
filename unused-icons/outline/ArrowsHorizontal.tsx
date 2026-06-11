import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsHorizontal = (props: SvgProps) => (
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
    <Path d="M7 8l-4 4l4 4" />
    <Path d="M17 8l4 4l-4 4" />
    <Path d="M3 12l18 0" />
  </Svg>
);
export default SvgArrowsHorizontal;
