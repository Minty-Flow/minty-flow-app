import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDiagonalMinimize2 = (props: SvgProps) => (
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
    <Path d="M18 10h-4v-4" />
    <Path d="M20 4l-6 6" />
    <Path d="M6 14h4v4" />
    <Path d="M10 14l-6 6" />
  </Svg>
);
export default SvgArrowsDiagonalMinimize2;
