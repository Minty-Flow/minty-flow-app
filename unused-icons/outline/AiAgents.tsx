import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAiAgents = (props: SvgProps) => (
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
    <Path d="M17 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 5a1 1 0 1 0 -2 0a1 1 0 0 0 2 0" />
    <Path d="M18 5a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M4 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M18 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M11 19a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
  </Svg>
);
export default SvgAiAgents;
