import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBathOff = (props: SvgProps) => (
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
    <Path d="M16 12h4a1 1 0 0 1 1 1v3c0 .311 -.036 .614 -.103 .904m-1.61 2.378a3.982 3.982 0 0 1 -2.287 .718h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1h8" />
    <Path d="M6 12v-6m1.178 -2.824c.252 -.113 .53 -.176 .822 -.176h3v2.25" />
    <Path d="M4 21l1 -1.5" />
    <Path d="M20 21l-1 -1.5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBathOff;
