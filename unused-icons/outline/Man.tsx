import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMan = (props: SvgProps) => (
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
    <Path d="M9 9h6l-1 7h-4l-1 -7" />
    <Path d="M5 11c1.333 -1.333 2.667 -2 4 -2" />
    <Path d="M19 11c-1.333 -1.333 -2.667 -2 -4 -2" />
    <Path d="M10 4a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgMan;
