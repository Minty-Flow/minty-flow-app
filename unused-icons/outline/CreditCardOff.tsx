import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCreditCardOff = (props: SvgProps) => (
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
    <Path d="M3 3l18 18" />
    <Path d="M9 5h9a3 3 0 0 1 3 3v8a3 3 0 0 1 -.128 .87" />
    <Path d="M18.87 18.872a3 3 0 0 1 -.87 .128h-12a3 3 0 0 1 -3 -3v-8c0 -1.352 .894 -2.495 2.124 -2.87" />
    <Path d="M3 11l8 0" />
    <Path d="M15 11l6 0" />
    <Path d="M7 15l.01 0" />
    <Path d="M11 15l2 0" />
  </Svg>
);
export default SvgCreditCardOff;
