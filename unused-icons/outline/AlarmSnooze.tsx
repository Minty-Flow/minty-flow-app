import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlarmSnooze = (props: SvgProps) => (
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
    <Path d="M5 13a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M10 11h4l-4 4h4" />
    <Path d="M7 4l-2.75 2" />
    <Path d="M17 4l2.75 2" />
  </Svg>
);
export default SvgAlarmSnooze;
