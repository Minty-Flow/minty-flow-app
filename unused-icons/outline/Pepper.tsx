import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPepper = (props: SvgProps) => (
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
    <Path d="M13 11c0 2.21 -2.239 4 -5 4s-5 -1.79 -5 -4a8 8 0 1 0 16 0a3 3 0 0 0 -6 0" />
    <Path d="M16 8c0 -2 2 -4 4 -4" />
  </Svg>
);
export default SvgPepper;
