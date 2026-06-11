import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLegoOff = (props: SvgProps) => (
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
    <Path d="M9.5 11h.01" />
    <Path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
    <Path d="M8 4v-1h8v2h1a3 3 0 0 1 3 3v8m-.884 3.127a2.99 2.99 0 0 1 -2.116 .873v1h-10v-1a3 3 0 0 1 -3 -3v-9c0 -1.083 .574 -2.032 1.435 -2.56" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgLegoOff;
