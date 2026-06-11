import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlarmOff = (props: SvgProps) => (
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
    <Path d="M7.587 7.566a7 7 0 1 0 9.833 9.864m1.35 -2.645a7 7 0 0 0 -8.536 -8.56" />
    <Path d="M12 12v1h1" />
    <Path d="M5.261 5.265l-1.011 .735" />
    <Path d="M17 4l2.75 2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAlarmOff;
