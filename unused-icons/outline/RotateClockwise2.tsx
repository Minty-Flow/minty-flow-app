import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRotateClockwise2 = (props: SvgProps) => (
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
    <Path d="M9 4.55a8 8 0 0 1 6 14.9m0 -4.45v5h5" />
    <Path d="M5.63 7.16l0 .01" />
    <Path d="M4.06 11l0 .01" />
    <Path d="M4.63 15.1l0 .01" />
    <Path d="M7.16 18.37l0 .01" />
    <Path d="M11 19.94l0 .01" />
  </Svg>
);
export default SvgRotateClockwise2;
