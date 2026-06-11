import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrowserOff = (props: SvgProps) => (
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
    <Path d="M8 4h11a1 1 0 0 1 1 1v11m-.288 3.702a1 1 0 0 1 -.712 .298h-14a1 1 0 0 1 -1 -1v-14c0 -.276 .112 -.526 .293 -.707" />
    <Path d="M4 8h4m4 0h8" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBrowserOff;
