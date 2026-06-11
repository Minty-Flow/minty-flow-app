import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBarrierBlockOff = (props: SvgProps) => (
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
    <Path d="M11 7h8a1 1 0 0 1 1 1v7c0 .27 -.107 .516 -.282 .696" />
    <Path d="M16 16h-11a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h2" />
    <Path d="M7 16v4" />
    <Path d="M7.5 16l4.244 -4.244" />
    <Path d="M13.745 9.755l2.755 -2.755" />
    <Path d="M13.5 16l1.249 -1.249" />
    <Path d="M16.741 12.759l3.259 -3.259" />
    <Path d="M4 13.5l4.752 -4.752" />
    <Path d="M17 17v3" />
    <Path d="M5 20h4" />
    <Path d="M15 20h4" />
    <Path d="M17 7v-2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBarrierBlockOff;
