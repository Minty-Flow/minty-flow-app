import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHttpQueOff = (props: SvgProps) => (
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
    <Path d="M5 8a2 2 0 0 1 2 2v4a2 2 0 1 1 -4 0v-4a2 2 0 0 1 2 -2" />
    <Path d="M6 15l1 1" />
    <Path d="M21 8h-4v8h4" />
    <Path d="M17 12h2.5" />
    <Path d="M10 10v4a2 2 0 1 0 4 0m0 -4v-2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHttpQueOff;
