import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArmchair2 = (props: SvgProps) => (
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
    <Path d="M5 10v-4a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v4" />
    <Path d="M16 15v-2a3 3 0 1 1 3 3v3h-14v-3a3 3 0 1 1 3 -3v2" />
    <Path d="M8 12h8" />
    <Path d="M7 19v2" />
    <Path d="M17 19v2" />
  </Svg>
);
export default SvgArmchair2;
