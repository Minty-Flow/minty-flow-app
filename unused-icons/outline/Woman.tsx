import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWoman = (props: SvgProps) => (
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
    <Path d="M10 16v5" />
    <Path d="M14 16v5" />
    <Path d="M8 16h8l-2 -7h-4l-2 7" />
    <Path d="M5 11c1.667 -1.333 3.333 -2 5 -2" />
    <Path d="M19 11c-1.667 -1.333 -3.333 -2 -5 -2" />
    <Path d="M10 4a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgWoman;
