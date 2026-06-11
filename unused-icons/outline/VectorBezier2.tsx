import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVectorBezier2 = (props: SvgProps) => (
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
    <Path d="M3 4a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M17 18a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M7 5l7 0" />
    <Path d="M10 19l7 0" />
    <Path d="M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M7 5.5a5 6.5 0 0 1 5 6.5a5 6.5 0 0 0 5 6.5" />
  </Svg>
);
export default SvgVectorBezier2;
