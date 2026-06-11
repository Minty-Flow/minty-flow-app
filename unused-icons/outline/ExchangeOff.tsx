import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExchangeOff = (props: SvgProps) => (
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
    <Path d="M3 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M19 8v5c0 .594 -.104 1.164 -.294 1.692m-1.692 2.298a4.978 4.978 0 0 1 -3.014 1.01h-3l3 -3" />
    <Path d="M14 21l-3 -3" />
    <Path d="M5 16v-5c0 -1.632 .782 -3.082 1.992 -4m3.008 -1h3l-3 -3" />
    <Path d="M11.501 7.499l1.499 -1.499" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgExchangeOff;
