import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCellSignalOff = (props: SvgProps) => (
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
    <Path d="M20 20h-15.269a.731 .731 0 0 1 -.517 -1.249l7.265 -7.264m2 -2l5.272 -5.272a.731 .731 0 0 1 1.249 .517v11.269" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCellSignalOff;
