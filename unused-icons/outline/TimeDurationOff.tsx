import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimeDurationOff = (props: SvgProps) => (
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
    <Path d="M3 12v.01" />
    <Path d="M7.5 19.8v.01" />
    <Path d="M4.2 16.5v.01" />
    <Path d="M4.2 7.5v.01" />
    <Path d="M12 21a8.994 8.994 0 0 0 6.362 -2.634m1.685 -2.336a9 9 0 0 0 -8.047 -13.03" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTimeDurationOff;
