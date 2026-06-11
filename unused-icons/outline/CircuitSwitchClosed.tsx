import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitSwitchClosed = (props: SvgProps) => (
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
    <Path d="M2 12h2" />
    <Path d="M20 12h2" />
    <Path d="M4 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M8 12h8" />
  </Svg>
);
export default SvgCircuitSwitchClosed;
