import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHttpDeleteOff = (props: SvgProps) => (
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
    <Path d="M3 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2l-2 0" />
    <Path d="M14 8h-2m-2 2v6h4" />
    <Path d="M10 12h2" />
    <Path d="M17 8v5m3 3h1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHttpDeleteOff;
