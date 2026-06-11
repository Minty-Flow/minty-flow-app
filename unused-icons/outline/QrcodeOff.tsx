import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgQrcodeOff = (props: SvgProps) => (
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
    <Path d="M8 4h1a1 1 0 0 1 1 1v1m-.297 3.711a1 1 0 0 1 -.703 .289h-4a1 1 0 0 1 -1 -1v-4c0 -.275 .11 -.524 .29 -.705" />
    <Path d="M7 17v.01" />
    <Path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M7 7v.01" />
    <Path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M17 7v.01" />
    <Path d="M20 14v.01" />
    <Path d="M14 14v3" />
    <Path d="M14 20h3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgQrcodeOff;
