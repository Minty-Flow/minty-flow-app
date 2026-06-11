import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgView360Arrow = (props: SvgProps) => (
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
    <Path d="M17 15.328c2.414 -.718 4 -1.94 4 -3.328c0 -2.21 -4.03 -4 -9 -4s-9 1.79 -9 4s4.03 4 9 4" />
    <Path d="M9 13l3 3l-3 3" />
  </Svg>
);
export default SvgView360Arrow;
