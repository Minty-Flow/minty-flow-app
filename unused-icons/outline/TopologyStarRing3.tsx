import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTopologyStarRing3 = (props: SvgProps) => (
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
    <Path d="M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M6 12h4" />
    <Path d="M14 12h4" />
    <Path d="M15 7l-2 3" />
    <Path d="M9 7l2 3" />
    <Path d="M11 14l-2 3" />
    <Path d="M13 14l2 3" />
    <Path d="M10 5h4" />
    <Path d="M10 19h4" />
    <Path d="M17 17l2 -3" />
    <Path d="M19 10l-2 -3" />
    <Path d="M7 7l-2 3" />
    <Path d="M5 14l2 3" />
  </Svg>
);
export default SvgTopologyStarRing3;
