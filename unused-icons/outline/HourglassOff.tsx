import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHourglassOff = (props: SvgProps) => (
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
    <Path d="M18 18v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-2a6 6 0 0 1 6 -6" />
    <Path d="M6 6a6 6 0 0 0 6 6m3.13 -.88a6 6 0 0 0 2.87 -5.12v-2a1 1 0 0 0 -1 -1h-10" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHourglassOff;
