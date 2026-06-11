import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVectorBezier = (props: SvgProps) => (
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
    <Path d="M3 15a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M17 15a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M10 7a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M10 8.5a6 6 0 0 0 -5 5.5" />
    <Path d="M14 8.5a6 6 0 0 1 5 5.5" />
    <Path d="M10 8l-6 0" />
    <Path d="M20 8l-6 0" />
    <Path d="M2 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M20 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgVectorBezier;
