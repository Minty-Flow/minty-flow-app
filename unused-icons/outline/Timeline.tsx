import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimeline = (props: SvgProps) => (
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
    <Path d="M4 16l6 -7l5 5l5 -6" />
    <Path d="M14 14a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M9 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M3 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M19 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgTimeline;
