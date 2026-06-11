import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBinaryOff = (props: SvgProps) => (
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
    <Path d="M11 7v-2h-1" />
    <Path d="M18 19v-1" />
    <Path d="M15.5 5h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5v-4a.5 .5 0 0 1 .5 -.5" />
    <Path d="M10.5 14h2a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-2a.5 .5 0 0 1 -.5 -.5v-4a.5 .5 0 0 1 .5 -.5" />
    <Path d="M6 10v.01" />
    <Path d="M6 19v.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBinaryOff;
