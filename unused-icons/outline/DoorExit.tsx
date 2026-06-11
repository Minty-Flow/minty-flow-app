import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDoorExit = (props: SvgProps) => (
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
    <Path d="M13 12v.01" />
    <Path d="M3 21h18" />
    <Path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5" />
    <Path d="M14 7h7m-3 -3l3 3l-3 3" />
  </Svg>
);
export default SvgDoorExit;
