import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHierarchy3 = (props: SvgProps) => (
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
    <Path d="M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M18 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M2 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M14 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 17l2 -3" />
    <Path d="M9 10l2 -3" />
    <Path d="M13 7l2 3" />
    <Path d="M17 14l2 3" />
    <Path d="M15 14l-2 3" />
    <Path d="M9 14l2 3" />
  </Svg>
);
export default SvgHierarchy3;
