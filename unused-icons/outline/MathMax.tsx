import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathMax = (props: SvgProps) => (
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
    <Path d="M5 6a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M3 15s.616 -5.544 2.332 -7.93" />
    <Path d="M8.637 7.112c2.717 3.313 5.882 12.888 8.363 12.888c2 0 3.333 -3 4 -9" />
  </Svg>
);
export default SvgMathMax;
