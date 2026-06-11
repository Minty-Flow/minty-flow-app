import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRobotOff = (props: SvgProps) => (
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
    <Path d="M8 4h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2m-4 0h-4a2 2 0 0 1 -2 -2v-4" />
    <Path d="M12 2v2" />
    <Path d="M9 12v9" />
    <Path d="M15 15v6" />
    <Path d="M5 16l4 -2" />
    <Path d="M9 18h6" />
    <Path d="M14 8v.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRobotOff;
