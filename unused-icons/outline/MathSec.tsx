import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathSec = (props: SvgProps) => (
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
    <Path d="M3 15c.345 .6 1.258 1 2 1a2 2 0 1 0 0 -4a2 2 0 1 1 0 -4c.746 0 1.656 .394 2 1" />
    <Path d="M21 10a2 2 0 1 0 -4 0v4a2 2 0 1 0 4 0" />
    <Path d="M14 8h-4v8h4" />
    <Path d="M10 12h2.5" />
  </Svg>
);
export default SvgMathSec;
