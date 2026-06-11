import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgView360 = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M8 12a4 9 0 1 0 8 0a4 9 0 1 0 -8 0" />
    <Path d="M3 12c0 2.21 4.03 4 9 4s9 -1.79 9 -4s-4.03 -4 -9 -4s-9 1.79 -9 4" />
  </Svg>
);
export default SvgView360;
