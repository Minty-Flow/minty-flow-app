import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChristmasBall = (props: SvgProps) => (
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
    <Path d="M4 13a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
    <Path d="M11 5l1 -2l1 2" />
    <Path d="M4.512 10.161c2.496 -1.105 4.992 -.825 7.488 .839c2.627 1.752 5.255 1.97 7.882 .653" />
    <Path d="M4.315 15.252c2.561 -1.21 5.123 -.96 7.685 .748c2.293 1.528 4.585 1.889 6.878 1.081" />
  </Svg>
);
export default SvgChristmasBall;
