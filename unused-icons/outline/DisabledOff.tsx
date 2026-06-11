import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDisabledOff = (props: SvgProps) => (
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
    <Path d="M11 7a2 2 0 1 0 -2 -2" />
    <Path d="M11 11v4h4l4 5" />
    <Path d="M15 11h1" />
    <Path d="M7 11.5a5 5 0 1 0 6 7.5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDisabledOff;
