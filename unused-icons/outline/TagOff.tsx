import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTagOff = (props: SvgProps) => (
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
    <Path d="M7.149 7.144a.498 .498 0 0 0 .351 .856a.498 .498 0 0 0 .341 -.135" />
    <Path d="M3.883 3.875a2.99 2.99 0 0 0 -.883 2.125v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l2.796 -2.796m2.005 -2.005l.79 -.79a2.41 2.41 0 0 0 0 -3.41l-7.71 -7.71a2 2 0 0 0 -1.412 -.585h-4.173" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTagOff;
