import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingOff = (props: SvgProps) => (
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
    <Path d="M9 12h1" />
    <Path d="M9 16h1" />
    <Path d="M14 8h1" />
    <Path d="M14 16h1" />
    <Path d="M5 21v-16" />
    <Path d="M7 3h10c1 0 2 1 2 2v10" />
    <Path d="M19 19v2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBuildingOff;
