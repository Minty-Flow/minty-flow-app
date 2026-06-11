import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSkateboard = (props: SvgProps) => (
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
    <Path d="M5 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 9a2 1 0 0 0 2 1h14a2 1 0 0 0 2 -1" />
  </Svg>
);
export default SvgSkateboard;
