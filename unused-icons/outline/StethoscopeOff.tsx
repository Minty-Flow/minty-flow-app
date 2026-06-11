import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStethoscopeOff = (props: SvgProps) => (
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
    <Path d="M4.172 4.179a2 2 0 0 0 -1.172 1.821v3.5a5.5 5.5 0 0 0 9.856 3.358m1.144 -2.858v-4a2 2 0 0 0 -2 -2h-1" />
    <Path d="M8 15a6 6 0 0 0 10.714 3.712m1.216 -2.798c.046 -.3 .07 -.605 .07 -.914v-3" />
    <Path d="M11 3v2" />
    <Path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgStethoscopeOff;
