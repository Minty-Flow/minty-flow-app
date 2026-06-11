import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHttpHeadOff = (props: SvgProps) => (
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
    <Path d="M3 16v-8" />
    <Path d="M7 8v8" />
    <Path d="M3 12h4" />
    <Path d="M14 8h-2m-2 2v6h4" />
    <Path d="M10 12h2" />
    <Path d="M17 13v-3a2 2 0 1 1 4 0v6" />
    <Path d="M17 13h4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHttpHeadOff;
