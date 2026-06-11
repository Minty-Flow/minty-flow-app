import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRobot = (props: SvgProps) => (
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
    <Path d="M6 6a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -4" />
    <Path d="M12 2v2" />
    <Path d="M9 12v9" />
    <Path d="M15 12v9" />
    <Path d="M5 16l4 -2" />
    <Path d="M15 14l4 2" />
    <Path d="M9 18h6" />
    <Path d="M10 8v.01" />
    <Path d="M14 8v.01" />
  </Svg>
);
export default SvgRobot;
