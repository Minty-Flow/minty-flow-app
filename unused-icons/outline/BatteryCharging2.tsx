import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBatteryCharging2 = (props: SvgProps) => (
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
    <Path d="M4 9a2 2 0 0 1 2 -2h11a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-4.5" />
    <Path d="M3 15h6v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-2" />
    <Path d="M6 22v-3" />
    <Path d="M4 15v-2.5" />
    <Path d="M8 15v-2.5" />
  </Svg>
);
export default SvgBatteryCharging2;
