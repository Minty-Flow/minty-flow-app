import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodOff = (props: SvgProps) => (
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
    <Path d="M5.634 5.638a9 9 0 0 0 12.732 12.724m1.679 -2.322a9 9 0 0 0 -12.08 -12.086" />
    <Path d="M9 10h.01" />
    <Path d="M15 10h.01" />
    <Path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMoodOff;
