import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceCctvOff = (props: SvgProps) => (
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
    <Path d="M7 7h-3a1 1 0 0 1 -1 -1v-2c0 -.275 .11 -.523 .29 -.704m3.71 -.296h13a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-9" />
    <Path d="M10.36 10.35a4 4 0 1 0 5.285 5.3" />
    <Path d="M19 7v7c0 .321 -.022 .637 -.064 .947m-1.095 2.913a7 7 0 0 1 -12.841 -3.86l0 -7" />
    <Path d="M12 14h.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDeviceCctvOff;
