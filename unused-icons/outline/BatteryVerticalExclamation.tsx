import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBatteryVerticalExclamation = (props: SvgProps) => (
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
    <Path d="M17 12v-5c0 -1.105 -.895 -2 -2 -2h-.5c-.276 0 -.5 -.224 -.5 -.5s-.224 -.5 -.5 -.5h-3c-.276 0 -.5 .224 -.5 .5s-.224 .5 -.5 .5h-.5c-1.105 0 -2 .895 -2 2v11c0 1.105 .895 2 2 2h6" />
    <Path d="M19 16v3" />
    <Path d="M19 22v.01" />
  </Svg>
);
export default SvgBatteryVerticalExclamation;
