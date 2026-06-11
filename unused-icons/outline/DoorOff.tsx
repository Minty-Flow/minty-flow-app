import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDoorOff = (props: SvgProps) => (
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
    <Path d="M3 21h18" />
    <Path d="M6 21v-15" />
    <Path d="M7.18 3.175c.25 -.112 .528 -.175 .82 -.175h8a2 2 0 0 1 2 2v9" />
    <Path d="M18 18v3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDoorOff;
