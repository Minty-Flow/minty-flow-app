import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScissorsOff = (props: SvgProps) => (
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
    <Path d="M4.432 4.442a3 3 0 1 0 4.114 4.146" />
    <Path d="M3 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M8.6 15.4l3.4 -3.4m2 -2l5 -5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgScissorsOff;
