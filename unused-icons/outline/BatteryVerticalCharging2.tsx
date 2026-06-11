import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBatteryVerticalCharging2 = (props: SvgProps) => (
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
    <Path d="M7 18v-11c0 -1.105 .895 -2 2 -2h.5c.276 0 .5 -.224 .5 -.5s.224 -.5 .5 -.5h3c.276 0 .5 .224 .5 .5s.224 .5 .5 .5h.5c1.105 0 2 .895 2 2v1m-10 10c0 1.105 .895 2 2 2h1" />
    <Path d="M12 14h6v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -2" />
    <Path d="M15 21v-3" />
    <Path d="M13 14v-2.5" />
    <Path d="M17 14v-2.5" />
  </Svg>
);
export default SvgBatteryVerticalCharging2;
