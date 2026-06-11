import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTxt = (props: SvgProps) => (
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
    <Path d="M3 8h4" />
    <Path d="M5 8v8" />
    <Path d="M17 8h4" />
    <Path d="M19 8v8" />
    <Path d="M10 8l4 8" />
    <Path d="M10 16l4 -8" />
  </Svg>
);
export default SvgTxt;
