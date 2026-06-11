import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArmchairOff = (props: SvgProps) => (
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
    <Path d="M17 13a2 2 0 1 1 4 0v4m-2 2h-14a2 2 0 0 1 -2 -2v-4a2 2 0 1 1 4 0v2h8.036" />
    <Path d="M5 11v-5a3 3 0 0 1 .134 -.89m1.987 -1.98a3 3 0 0 1 .879 -.13h8a3 3 0 0 1 3 3v5" />
    <Path d="M6 19v2" />
    <Path d="M18 19v2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgArmchairOff;
