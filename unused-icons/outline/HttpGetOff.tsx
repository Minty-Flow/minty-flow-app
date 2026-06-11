import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHttpGetOff = (props: SvgProps) => (
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
    <Path d="M7 8h-2a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2v-4h-1" />
    <Path d="M14 8h-2m-2 2v6h4" />
    <Path d="M10 12h2" />
    <Path d="M17 8h4" />
    <Path d="M19 8v7" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHttpGetOff;
